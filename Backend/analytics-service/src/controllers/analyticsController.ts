import { Request, Response } from 'express';
import AnalyticsModel from '../model/analyticsModel';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define interfaces for our data structures
interface ProcessedData {
    type: 'numerical' | 'categorical' | 'date' | 'text';
    summary: NumericalSummary | CategoricalSummary | DateSummary | TextSummary;
    data: any[];
}

interface NumericalSummary {
    average: number;
    min: number;
    max: number;
    count: number;
}

interface CategoricalSummary {
    uniqueValues: number;
    mostCommon: { [key: string]: number };
}

interface DateSummary {
    earliest: Date;
    latest: Date;
    count: number;
}

interface TextSummary {
    count: number;
}

interface FrequencyMap {
    [key: string]: number;
}

class AnalyticsController {
    async uploadFeedback(req: Request, res: Response) {
        const mongoId = req.body.mongoId;
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API_KEY is not defined in environment variables' });
        }

        try {
            const feedbackServiceURL = `http://localhost:3001/api/feedback/feedback/mongoId/${mongoId}`;
            const { data: feedbackData } = await axios.get(feedbackServiceURL);
            console.log('Feedback data received:', feedbackData);

            const scaledData: { [key: string]: any } = {};
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            if (feedbackData && typeof feedbackData === 'object') {
                for (const key in feedbackData) {
                    const columnData = feedbackData[key];
                    console.log(`Processing column: ${key}, Column Data:`, columnData);

                    const dataType = this.detectDataType(columnData);
                    
                    if (Array.isArray(columnData) && columnData.length > 500) {
                        const prompt = this.createPrompt(key, columnData, dataType);

                        try {
                            const jsonData = await fetchFromAPIWithRetry(prompt, model);
                            const structuredData = this.structureResponse(jsonData, dataType);
                            console.log(`Transformed data for column ${key}:`, structuredData);
                            scaledData[key] = structuredData;
                        } catch (apiError: any) {
                            console.error(`API request failed for ${key}:`, apiError.message);
                            scaledData[key] = this.basicDataProcessing(columnData, dataType);
                        }
                    } else {
                        scaledData[key] = this.basicDataProcessing(columnData, dataType);
                    }
                }
            } else {
                console.error('No valid feedback data received.');
                return res.status(400).json({ error: 'No valid feedback data received' });
            }

            console.log('Processed scaled data:', scaledData);

            const analyticsEntry = new AnalyticsModel({
                mongoId,
                processedData: scaledData,
                createdAt: new Date(),
            });
            await analyticsEntry.save();

            res.status(200).json({ message: 'Feedback processed and saved successfully', scaledData });
        } catch (error: any) {
            console.error('Error in uploadFeedback:', error);
            res.status(500).json({ error: error.message });
        }
    }

    private detectDataType(data: any): 'numerical' | 'categorical' | 'date' | 'text' {
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];
        if (dataArray.length === 0) return 'text';
        
        const sample = dataArray.find(item => item !== null && item !== undefined);
        if (!sample) return 'text';
    
        if (!isNaN(Number(sample))) return 'numerical';
        if (Date.parse(sample)) return 'date';
        return 'categorical';
    }

    private basicDataProcessing(data: any, dataType: string): ProcessedData {
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];
        const cleanData = dataArray.filter(item => item !== null && item !== undefined);
        
        switch (dataType) {
            case 'numerical': {
                const numbers = cleanData.map(Number).filter(n => !isNaN(n));
                const sum = numbers.reduce((a: number, b: number) => a + b, 0);
                return {
                    type: 'numerical',
                    summary: {
                        average: numbers.length ? sum / numbers.length : 0,
                        min: numbers.length ? Math.min(...numbers) : 0,
                        max: numbers.length ? Math.max(...numbers) : 0,
                        count: numbers.length
                    },
                    data: numbers.slice(0, 100)
                };
            }
            
            case 'categorical': {
                const frequencyMap:any[]= cleanData.reduce((acc: FrequencyMap, val: string) => {
                    acc[val] = (acc[val] || 0) + 1;
                    return acc;
                }, {} as FrequencyMap);
    
                const sortedEntries = Object.entries(frequencyMap)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10);
    
                const mostCommon = sortedEntries.reduce<FrequencyMap>((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});
    
                return {
                    type: 'categorical',
                    summary: {
                        uniqueValues: Object.keys(frequencyMap).length,
                        mostCommon
                    },
                    data: frequencyMap
                };
            }
            
            case 'date': {
                const dates = cleanData
                    .map(d => new Date(d))
                    .filter(d => !isNaN(d.getTime()));
                
                if (dates.length === 0) {
                    return {
                        type: 'date',
                        summary: {
                            earliest: new Date(),
                            latest: new Date(),
                            count: 0
                        },
                        data: []
                    };
                }
    
                return {
                    type: 'date',
                    summary: {
                        earliest: new Date(Math.min(...dates.map(d => d.getTime()))),
                        latest: new Date(Math.max(...dates.map(d => d.getTime()))),
                        count: dates.length
                    },
                    data: dates.slice(0, 100).map(d => d.toISOString().split('T')[0])
                };
            }
            
            default:
                return {
                    type: 'text',
                    summary: {
                        count: cleanData.length
                    },
                    data: cleanData.slice(0, 100)
                };
        }
    }

    private createPrompt(columnName: string, columnData: any[], dataType: string): string {
        return `
Analyze and transform the following dataset for visualization purposes. 
Column Name: ${columnName}
Data Type: ${dataType}

Required Output Format:
{
    "type": "${dataType}",
    "summary": {
        // For numerical data:
        "average": number,
        "median": number,
        "min": number,
        "max": number,
        "standardDeviation": number,
        "quartiles": [number, number, number],
        "distribution": {
            "bins": [number ranges],
            "counts": [frequencies]
        }
        
        // For categorical data:
        "totalCount": number,
        "uniqueCategories": number,
        "topCategories": {
            "category1": count,
            "category2": count,
            ...
        },
        "distribution": {
            "categories": [top 10 categories],
            "counts": [corresponding counts]
        }
        
        // For date data:
        "timeRange": {
            "start": "YYYY-MM-DD",
            "end": "YYYY-MM-DD"
        },
        "frequency": {
            "daily": {"YYYY-MM-DD": count},
            "monthly": {"YYYY-MM": count},
            "yearly": {"YYYY": count}
        }
    },
    "visualizationReady": {
        "pieChart": [{"label": string, "value": number}],
        "lineChart": [{"x": string/number, "y": number}],
        "barChart": [{"category": string, "value": number}]
    }
}

Input Data: ${JSON.stringify(columnData.slice(0, 1000))}

Rules:
1. Remove all null, undefined, or invalid values before processing
2. For numerical data, create meaningful distribution bins
3. For categorical data, group rare categories into "Others" if they represent less than 1% of total
4. For dates, provide aggregated counts by different time periods
5. Format all numbers to maximum 2 decimal places
6. Include pre-formatted data structures ready for common chart types
7. Return ONLY valid JSON - no explanations or additional text`;
    }

    private structureResponse(response: any, dataType: string): ProcessedData {
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response structure');
        }

        const requiredFields = ['type', 'summary', 'visualizationReady'];
        if (!requiredFields.every(field => field in response)) {
            throw new Error('Missing required fields in response');
        }

        return response as ProcessedData;
    }
}

async function fetchFromAPIWithRetry(prompt: string, model: any, retries: number = 3, delay: number = 1000): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const apiResponse = await model.generateContent(prompt);
            const responseText = await apiResponse.response.text();
            
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('No JSON object found in response');
                }
                return JSON.parse(jsonMatch[0]);
            } catch (jsonError) {
                console.error("Invalid JSON format received:", jsonError);
                if (i === retries - 1) {
                    throw new Error("API response is not valid JSON after multiple attempts");
                }
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                throw new Error("API request failed after multiple attempts");
            }
        }
    }
}

export default new AnalyticsController();
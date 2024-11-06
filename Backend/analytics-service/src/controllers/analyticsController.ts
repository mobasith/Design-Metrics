import { Request, Response } from 'express';
import AnalyticsModel from '../model/analyticsModel';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define interfaces for our data structures
interface ProcessedData {
    type: 'numerical' | 'categorical' | 'date' | 'text';
    summary: NumericalSummary | CategoricalSummary | DateSummary | TextSummary;
    data: any[];
    chartData: {
        pie: ChartDataPoint[];
        donut: ChartDataPoint[];
    };
    insights: {
        summary: string;
        keyTakeaways: string[];
    };
}

interface ChartDataPoint {
    label: string;
    value: number;
}

interface NumericalSummary {
    average: number;
    min: number;
    max: number;
    count: number;
    ranges: { [key: string]: { start: number; end: number; count: number } };
}

interface CategoricalSummary {
    uniqueValues: number;
    mostCommon: { [key: string]: number };
}

interface DateSummary {
    earliest: Date;
    latest: Date;
    count: number;
    timeGroups: { [key: string]: number };
}

interface TextSummary {
    count: number;
}

interface FrequencyMap {
    [key: string]: number;
}

class AnalyticsController {
    async uploadFeedback(req: Request, res: Response) {
        const { mongoId, userId } = req.body;
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API_KEY is not defined in environment variables' });
        }

        if (!mongoId || userId === undefined) {
            return res.status(400).json({ error: 'mongoId and userId are required' });
        }

        // Validate userId is a number
        if (typeof userId !== 'number') {
            return res.status(400).json({ error: 'userId must be a number' });
        }

        try {
            const feedbackServiceURL = `http://localhost:3001/api/feedback/feedback/mongoId/${mongoId}`;
            const { data: feedbackData } = await axios.get(feedbackServiceURL);
            console.log('Feedback data received:', feedbackData);

            const scaledData: { [key: string]: ProcessedData } = {};
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            if (feedbackData && typeof feedbackData === 'object') {
                for (const key in feedbackData) {
                    const columnData = feedbackData[key];
                    console.log(`Processing column: ${key}, Column Data:`, columnData);

                    const dataType = this.detectDataType(columnData);
                    const processedData = await this.processColumnData(key, columnData, dataType, model);
                    scaledData[key] = processedData;
                }
            } else {
                console.error('No valid feedback data received.');
                return res.status(400).json({ error: 'No valid feedback data received' });
            }

            console.log('Processed scaled data:', scaledData);

            const analyticsEntry = new AnalyticsModel({
                mongoId,
                userId,
                processedData: scaledData,
                insights: {
                    summary: scaledData.insights?.summary,
                   keyTakeaways: scaledData.insights|| []
                },
                createdAt: new Date(),
            });
            await analyticsEntry.save();

            res.status(200).json({
                message: 'Feedback processed and saved successfully',
                scaledData,
                visualizationData: this.extractVisualizationData(scaledData)
            });
        } catch (error: any) {
            console.error('Error in uploadFeedback:', error);
            res.status(500).json({ error: error.message });
        }
    }

    private async processColumnData(columnName: string, columnData: any, dataType: string, model: any): Promise<ProcessedData> {
        const prompt = this.createPrompt(columnName, Array.isArray(columnData) ? columnData : [columnData], dataType);
    
        try {
            const jsonData = await this.fetchFromAPIWithRetry(prompt, model);
            return this.structureResponse(jsonData, dataType);
        } catch (apiError: any) {
            console.error(`API request failed for ${columnName}:`, apiError.message);
            return this.basicDataProcessing(Array.isArray(columnData) ? columnData : [columnData], dataType);
        }
    }

    private detectDataType(data: any): 'numerical' | 'categorical' | 'date' | 'text' {
        const dataArray = Array.isArray(data) ? data : [data];
        if (dataArray.length === 0) return 'text';

        const sample = dataArray.find(item => item !== null && item !== undefined);
        if (!sample) return 'text';

        if (!isNaN(Number(sample))) return 'numerical';
        if (Date.parse(sample)) return 'date';
        return 'categorical';
    }

    private basicDataProcessing(data: any, dataType: string): ProcessedData {
        const dataArray = Array.isArray(data) ? data : [data];
        const cleanData = dataArray.filter(item => item !== null && item !== undefined);

        switch (dataType) {
            case 'numerical': {
                const numbers = cleanData.map(Number).filter(n => !isNaN(n));
                const ranges = this.createNumericalRanges(numbers);
                const groupedData = this.groupNumericalData(numbers, ranges);

                const rangesObj: { [key: string]: { start: number; end: number; count: number } } = {};
                Object.entries(groupedData).forEach(([range, count]) => {
                    const [start, end] = range.split('-').map(Number);
                    rangesObj[range] = { start, end, count };
                });

                const chartData = Object.entries(groupedData).map(([range, count]) => ({
                    label: range,
                    value: count
                }));

                return {
                    type: 'numerical',
                    summary: {
                        average: numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0,
                        min: numbers.length ? Math.min(...numbers) : 0,
                        max: numbers.length ? Math.max(...numbers) : 0,
                        count: numbers.length,
                        ranges: rangesObj
                    },
                    data: numbers,
                    chartData: {
                        pie: chartData,
                        donut: chartData
                    },
                    insights: {
                        summary: '',
                        keyTakeaways: []
                    }
                };
            }

            case 'categorical': {
                const grouped = this.groupCategoricalData(cleanData);
                const chartData = Object.entries(grouped)
                    .map(([category, count]) => ({
                        label: category,
                        value: count
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 8);

                return {
                    type: 'categorical',
                    summary: {
                        uniqueValues: Object.keys(grouped).length,
                        mostCommon: grouped
                    },
                    data: cleanData,
                    chartData: {
                        pie: chartData,
                        donut: chartData
                    },
                    insights: {
                        summary: '',
                        keyTakeaways: []
                    }
                };
            }

            case 'date': {
                const dates = cleanData
                    .map(d => new Date(d))
                    .filter(d => !isNaN(d.getTime()));

                const groupedByMonth = this.groupDatesByPeriod(dates, 'month');
                const chartData = Object.entries(groupedByMonth)
                    .map(([period, count]) => ({
                        label: period,
                        value: count
                    }))
                    .slice(0, 8);

                return {
                    type: 'date',
                    summary: {
                        earliest: dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date(),
                        latest: dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date(),
                        count: dates.length,
                        timeGroups: groupedByMonth
                    },
                    data: dates.map(d => d.toISOString()),
                    chartData: {
                        pie: chartData,
                        donut: chartData
                    },
                    insights: {
                        summary: '',
                        keyTakeaways: []
                    }
                };
            }

            default:
                return {
                    type: 'text',
                    summary: {
                        count: cleanData.length
                    },
                    data: cleanData,
                    chartData: {
                        pie: [],
                        donut: []
                    },
                    insights: {
                        summary: '',
                        keyTakeaways: []
                    }
                };
        }
    }

    private createNumericalRanges(numbers: number[]): [number, number][] {
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const range = max - min;
        const binCount = Math.min(7, Math.ceil(Math.sqrt(numbers.length)));
        const binSize = range / binCount;

        return Array.from({ length: binCount }, (_, i) => [
            min + (i * binSize),
            min + ((i + 1) * binSize)
        ]);
    }

    private groupNumericalData(numbers: number[], ranges: [number, number][]): { [key: string]: number } {
        return numbers.reduce((acc: { [key: string]: number }, num) => {
            const range = ranges.find(([start, end]) => num >= start && num <= end);
            if (range) {
                const key = `${range[0].toFixed(1)}-${range[1].toFixed(1)}`;
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});
    }

    private groupCategoricalData(data: any[]): { [key: string]: number } {
        const initial = data.reduce((acc: { [key: string]: number }, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

        const total = Object.values(initial).reduce((a, b) => a + b, 0);
        const threshold = total * 0.05; // 5% threshold

        return Object.entries(initial).reduce((acc: { [key: string]: number }, [key, count]) => {
            if (count >= threshold) {
                acc[key] = count;
            } else {
                acc['Others'] = (acc['Others'] || 0) + count;
            }
            return acc;
        }, {});
    }

    private groupDatesByPeriod(dates: Date[], period: 'day' | 'month' | 'year'): { [key: string]: number } {
        return dates.reduce((acc: { [key: string]: number }, date) => {
            let key: string;
            switch (period) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                    break;
                case 'year':
                    key = date.getFullYear().toString();
                    break;
            }
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }

    private createPrompt(columnName: string, columnData: any[], dataType: string): string {
        return `
Analyze and transform the following dataset for visualization purposes, specifically optimized for pie and donut charts.
Column Name: ${columnName}
Data Type: ${dataType}

Required Output Format:
{
    "type": "${dataType}",
    "summary": {
        // For numerical data:
        "ranges": {
            "bin1": {"start": number, "end": number, "count": number},
            "bin2": {"start": number, "end": number, "count": number},
            // Maximum 7 bins for better visualization
        },
        
        // For categorical data:
        "categories": {
            "category1": count,
            "category2": count,
            // Group categories with less than 5% frequency into "Others"
        },
        
        // For date data:
        "timeGroups": {
            "period1": count,
            "period2": count
            // Group by months or quarters depending on data spread
        }
    },
    "chartData": {
        "pie": [
            {"label": string, "value": number}
            // Maximum 8 segments for better visualization
        ],
        "donut": [
            {"label": string, "value": number}
            // Same as pie chart data
        ]
    },
     "insights": {
        // Provide a summary or insights about the data
        "summary": "Provide a brief summary of the data",
        "keyTakeaways": [] // Use the correct spelling here
    }
}

Input Data: ${JSON.stringify(columnData.slice(0, 1000))}

Rules:
1. Remove null/undefined values
2. Group numerical data into meaningful ranges (max 7 bins)
3. For categorical data, group categories with <5% frequency into "Others"
4. For dates, group by appropriate time periods
5. Ensure no more than 8 segments in charts
6. Format numbers to 2 decimal places
7. Return only valid JSON
8. Return the summary of the data in a string format`;
    }

    private structureResponse(response: any, dataType: string): ProcessedData {
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response structure');
        }

        const { insights, ...processedResponse } = response;

        const overallInsights = {
            summary: insights?.summary || '',
            keyTakeaways: insights?.keyTakeaways || [] // Ensure keyTakeaways is an array
        };

        return {
            ...processedResponse,
            chartData: {
                pie: processedResponse.chartData?.pie || [],
                donut: processedResponse.chartData?.donut || []
            },
            insights: overallInsights
        };
    }

    private async fetchFromAPIWithRetry(prompt: string, model: any, retries: number = 3, delay: number = 1000): Promise<any> {
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

    private extractVisualizationData(scaledData: { [key: string]: ProcessedData }) {
        const visualizationData: { [key: string]: any } = {};
        
        for (const [key, data] of Object.entries(scaledData)) {
            if (data.chartData) {
                visualizationData[key] = {
                    type: data.type,
                    pie: data.chartData.pie,
                    donut: data.chartData.donut
                };
            }
        }
        return visualizationData;
    }
    // In the analyticsController.js file

// Add this new method to the AnalyticsController class
async getAllAnalytics(req: Request, res: Response) {
    try {
        const analytics = await AnalyticsModel.find({});
        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching all analytics:', error);
        res.status(500).json({ error: 'Error fetching analytics' });
    }
}

// In the analyticsController.js file

// Add this new method to the AnalyticsController class
async getAnalyticsByUserId(req: Request, res: Response) {
    const { userId } = req.params;

    try {
        const analytics = await AnalyticsModel.find({ userId });
        res.status(200).json(analytics);
    } catch (error) {
        console.error(`Error fetching analytics for userId ${userId}:`, error);
        res.status(500).json({ error: 'Error fetching analytics' });
    }
}
}


export default new AnalyticsController();
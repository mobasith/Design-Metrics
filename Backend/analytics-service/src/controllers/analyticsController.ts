import { Request, Response } from 'express';
import AnalyticsModel from '../model/analyticsModel';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define interfaces for data structures
interface ProcessedData {
    type: 'numerical' | 'categorical' | 'date' | 'text';
    summary: NumericalSummary | CategoricalSummary | DateSummary | TextSummary;
    data: any[];
    charts: {
        pieChart: ChartDataPoint[];
        donutChart: ChartDataPoint[];
    };
    columnInsights: {
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

            // Generate overall dataset insights
            const overallInsights = await this.generateOverallInsights(feedbackData, model);

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

            const analyticsEntry = new AnalyticsModel({
                mongoId,
                userId,
                processedData: scaledData,
                overallInsights,
                createdAt: new Date(),
            });
            await analyticsEntry.save();

            const response = {
                message: 'Feedback processed and saved successfully',
                charts: this.extractChartData(scaledData),
                insights: overallInsights,
                detailedData: scaledData
            };

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Error in uploadFeedback:', error);
            res.status(500).json({ error: error.message });
        }
    }

    private async generateOverallInsights(data: any, model: any): Promise<{ summary: string; keyTakeaways: string[] }> {
        const prompt = `
        Analyze this dataset and provide insights:
        1. Generate a comprehensive summary of the entire dataset
        2. List key takeaways and patterns observed
        3. Focus on relationships between different columns if any
        4. Highlight any unusual patterns or outliers
        
        Dataset: ${JSON.stringify(data)}
        
        Required format:
        {
            "summary": "A detailed summary of the dataset",
            "keyTakeaways": ["takeaway1", "takeaway2", ...]
        }`;

        try {
            const response = await this.fetchFromAPIWithRetry(prompt, model);
            return {
                summary: response.summary || "No summary available",
                keyTakeaways: Array.isArray(response.keyTakeaways) ? response.keyTakeaways : []
            };
        } catch (error) {
            console.error('Error generating overall insights:', error);
            return {
                summary: "Error generating insights",
                keyTakeaways: []
            };
        }
    }

    private detectDataType(data: any): 'numerical' | 'categorical' | 'date' | 'text' {
        const dataArray = Array.isArray(data) ? data : [data];
        if (dataArray.length === 0) return 'text';
    
        const sample = dataArray.find(item => item !== null && item !== undefined);
        if (!sample) return 'text';
    
        // Convert to number and check if it's valid
        const numberValue = Number(sample);
        if (!isNaN(numberValue) && typeof sample !== 'boolean') return 'numerical';
        
        // Try parsing as date
        if (Date.parse(sample)) return 'date';
        
        // If neither number nor date, treat as categorical
        return 'categorical';
    }

    private async processColumnData(columnName: string, columnData: any, dataType: string, model: any): Promise<ProcessedData> {
        // Convert columnData to array if it's not already
        const dataArray = Array.isArray(columnData) ? columnData : [columnData];
        
        const prompt = `
        Analyze this column data and provide insights:
        Column Name: ${columnName}
        Data Type: ${dataType}
        
        Required Output Format:
        {
            "type": "${dataType}",
            "summary": {
                // Appropriate summary based on data type
            },
            "charts": {
                "pieChart": [
                    {"label": string, "value": number}
                ],
                "donutChart": [
                    {"label": string, "value": number}
                ]
            },
            "columnInsights": {
                "summary": "Brief analysis of this column",
                "keyTakeaways": ["insight1", "insight2", ...]
            }
        }
        
        Data: ${JSON.stringify(dataArray.slice(0, 1000))}
        
        Rules:
        1. Clean null/undefined values
        2. Group numerical data into max 7 bins
        3. Group categorical data with <5% frequency into "Others"
        4. Maximum 8 segments in charts
        5. Format numbers to 2 decimal places
        6. Provide specific insights for this column
        `;
    
        try {
            const jsonData = await this.fetchFromAPIWithRetry(prompt, model);
            return this.structureResponse(jsonData, dataType, dataArray);
        } catch (error) {
            return this.basicDataProcessing(dataArray, dataType);
        }
    }

    private structureResponse(response: any, dataType: string, originalData: any[]): ProcessedData {
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response structure');
        }

        return {
            type: dataType as 'numerical' | 'categorical' | 'date' | 'text',
            summary: response.summary || {},
            data: originalData,
            charts: {
                pieChart: response.charts?.pieChart || [],
                donutChart: response.charts?.donutChart || []
            },
            columnInsights: {
                summary: response.columnInsights?.summary || "",
                keyTakeaways: response.columnInsights?.keyTakeaways || []
            }
        };
    }

    private basicDataProcessing(data: any[], dataType: string): ProcessedData {
        const cleanData = data.filter(item => item !== null && item !== undefined);

        switch (dataType) {
            case 'numerical': {
                const numbers = cleanData.map(Number).filter(n => !isNaN(n));
                const ranges = this.createNumericalRanges(numbers);
                const groupedData = this.groupNumericalData(numbers, ranges);

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
                        ranges: this.convertToRangeObject(groupedData)
                    },
                    data: numbers,
                    charts: {
                        pieChart: chartData,
                        donutChart: chartData
                    },
                    columnInsights: {
                        summary: "Basic numerical analysis",
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
                    charts: {
                        pieChart: chartData,
                        donutChart: chartData
                    },
                    columnInsights: {
                        summary: "Basic categorical analysis",
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
                    charts: {
                        pieChart: chartData,
                        donutChart: chartData
                    },
                    columnInsights: {
                        summary: "Basic date analysis",
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
                    charts: {
                        pieChart: [],
                        donutChart: []
                    },
                    columnInsights: {
                        summary: "Text data analysis",
                        keyTakeaways: []
                    }
                };
        }
    }

    private createNumericalRanges(numbers: number[]): [number, number][] {
        if (numbers.length === 0) return [];
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

    private convertToRangeObject(groupedData: { [key: string]: number }) {
        const rangeObject: { [key: string]: { start: number; end: number; count: number } } = {};
        for (const [range, count] of Object.entries(groupedData)) {
            const [start, end] = range.split('-').map(Number);
            rangeObject[range] = { start, end, count };
        }
        return rangeObject;
    }

    private groupCategoricalData(data: any[]): { [key: string]: number } {
        const initial = data.reduce((acc: { [key: string]: number }, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

        const total = Object.values(initial).reduce((a, b) => a + b, 0);
        const threshold = total * 0.05;

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

    private extractChartData(scaledData: { [key: string]: ProcessedData }) {
        const chartData: { [key: string]: {
            type: string;
            pieChart: ChartDataPoint[];
            donutChart: ChartDataPoint[];
        }} = {};
        
        for (const [key, data] of Object.entries(scaledData)) {
            chartData[key] = {
                type: data.type,
                pieChart: data.charts.pieChart,
                donutChart: data.charts.donutChart
            };
        
        }
        return chartData;
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
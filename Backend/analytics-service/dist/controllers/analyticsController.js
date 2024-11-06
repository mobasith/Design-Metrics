"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analyticsModel_1 = __importDefault(require("../model/analyticsModel"));
const axios_1 = __importDefault(require("axios"));
const generative_ai_1 = require("@google/generative-ai");
class AnalyticsController {
    uploadFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const { data: feedbackData } = yield axios_1.default.get(feedbackServiceURL);
                console.log('Feedback data received:', feedbackData);
                const scaledData = {};
                const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                if (feedbackData && typeof feedbackData === 'object') {
                    for (const key in feedbackData) {
                        const columnData = feedbackData[key];
                        console.log(`Processing column: ${key}, Column Data:`, columnData);
                        const dataType = this.detectDataType(columnData);
                        if (Array.isArray(columnData) && columnData.length > 500) {
                            const prompt = this.createPrompt(key, columnData, dataType);
                            try {
                                const jsonData = yield this.fetchFromAPIWithRetry(prompt, model);
                                const structuredData = this.structureResponse(jsonData, dataType);
                                console.log(`Transformed data for column ${key}:`, structuredData);
                                scaledData[key] = structuredData;
                            }
                            catch (apiError) {
                                console.error(`API request failed for ${key}:`, apiError.message);
                                scaledData[key] = this.basicDataProcessing(columnData, dataType);
                            }
                        }
                        else {
                            scaledData[key] = this.basicDataProcessing(columnData, dataType);
                        }
                    }
                }
                else {
                    console.error('No valid feedback data received.');
                    return res.status(400).json({ error: 'No valid feedback data received' });
                }
                console.log('Processed scaled data:', scaledData);
                const analyticsEntry = new analyticsModel_1.default({
                    mongoId,
                    userId,
                    processedData: scaledData,
                    createdAt: new Date(),
                });
                yield analyticsEntry.save();
                res.status(200).json({
                    message: 'Feedback processed and saved successfully',
                    scaledData,
                    visualizationData: this.extractVisualizationData(scaledData)
                });
            }
            catch (error) {
                console.error('Error in uploadFeedback:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    detectDataType(data) {
        const dataArray = Array.isArray(data) ? data : [data];
        if (dataArray.length === 0)
            return 'text';
        const sample = dataArray.find(item => item !== null && item !== undefined);
        if (!sample)
            return 'text';
        if (!isNaN(Number(sample)))
            return 'numerical';
        if (Date.parse(sample))
            return 'date';
        return 'categorical';
    }
    basicDataProcessing(data, dataType) {
        const dataArray = Array.isArray(data) ? data : [data];
        const cleanData = dataArray.filter(item => item !== null && item !== undefined);
        switch (dataType) {
            case 'numerical': {
                const numbers = cleanData.map(Number).filter(n => !isNaN(n));
                const ranges = this.createNumericalRanges(numbers);
                const groupedData = this.groupNumericalData(numbers, ranges);
                const rangesObj = {};
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
                    }
                };
        }
    }
    createNumericalRanges(numbers) {
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
    groupNumericalData(numbers, ranges) {
        return numbers.reduce((acc, num) => {
            const range = ranges.find(([start, end]) => num >= start && num <= end);
            if (range) {
                const key = `${range[0].toFixed(1)}-${range[1].toFixed(1)}`;
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});
    }
    groupCategoricalData(data) {
        const initial = data.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
        const total = Object.values(initial).reduce((a, b) => a + b, 0);
        const threshold = total * 0.05; // 5% threshold
        return Object.entries(initial).reduce((acc, [key, count]) => {
            if (count >= threshold) {
                acc[key] = count;
            }
            else {
                acc['Others'] = (acc['Others'] || 0) + count;
            }
            return acc;
        }, {});
    }
    groupDatesByPeriod(dates, period) {
        return dates.reduce((acc, date) => {
            let key;
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
    createPrompt(columnName, columnData, dataType) {
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
7. Return only valid JSON`;
    }
    structureResponse(response, dataType) {
        var _a, _b;
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response structure');
        }
        const processedResponse = Object.assign(Object.assign({}, response), { chartData: {
                pie: ((_a = response.chartData) === null || _a === void 0 ? void 0 : _a.pie) || [],
                donut: ((_b = response.chartData) === null || _b === void 0 ? void 0 : _b.donut) || []
            } });
        return processedResponse;
    }
    fetchFromAPIWithRetry(prompt_1, model_1) {
        return __awaiter(this, arguments, void 0, function* (prompt, model, retries = 3, delay = 1000) {
            for (let i = 0; i < retries; i++) {
                try {
                    const apiResponse = yield model.generateContent(prompt);
                    const responseText = yield apiResponse.response.text();
                    try {
                        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                        if (!jsonMatch) {
                            throw new Error('No JSON object found in response');
                        }
                        return JSON.parse(jsonMatch[0]);
                    }
                    catch (jsonError) {
                        console.error("Invalid JSON format received:", jsonError);
                        if (i === retries - 1) {
                            throw new Error("API response is not valid JSON after multiple attempts");
                        }
                    }
                }
                catch (error) {
                    console.error(`Attempt ${i + 1} failed:`, error);
                    if (i < retries - 1) {
                        yield new Promise(resolve => setTimeout(resolve, delay));
                        delay *= 2;
                    }
                    else {
                        throw new Error("API request failed after multiple attempts");
                    }
                }
            }
        });
    }
    extractVisualizationData(scaledData) {
        const visualizationData = {};
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
}
exports.default = new AnalyticsController();

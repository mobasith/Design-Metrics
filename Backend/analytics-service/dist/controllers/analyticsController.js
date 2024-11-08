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
                // Generate overall dataset insights
                const overallInsights = yield this.generateOverallInsights(feedbackData, model);
                if (feedbackData && typeof feedbackData === 'object') {
                    for (const key in feedbackData) {
                        const columnData = feedbackData[key];
                        console.log(`Processing column: ${key}, Column Data:`, columnData);
                        const dataType = this.detectDataType(columnData);
                        const processedData = yield this.processColumnData(key, columnData, dataType, model);
                        scaledData[key] = processedData;
                    }
                }
                else {
                    console.error('No valid feedback data received.');
                    return res.status(400).json({ error: 'No valid feedback data received' });
                }
                const analyticsEntry = new analyticsModel_1.default({
                    mongoId,
                    userId,
                    processedData: scaledData,
                    overallInsights,
                    createdAt: new Date(),
                });
                yield analyticsEntry.save();
                const response = {
                    message: 'Feedback processed and saved successfully',
                    charts: this.extractChartData(scaledData),
                    insights: overallInsights,
                    detailedData: scaledData
                };
                res.status(200).json(response);
            }
            catch (error) {
                console.error('Error in uploadFeedback:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    generateOverallInsights(data, model) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield this.fetchFromAPIWithRetry(prompt, model);
                return {
                    summary: response.summary || "No summary available",
                    keyTakeaways: Array.isArray(response.keyTakeaways) ? response.keyTakeaways : []
                };
            }
            catch (error) {
                console.error('Error generating overall insights:', error);
                return {
                    summary: "Error generating insights",
                    keyTakeaways: []
                };
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
        // Convert to number and check if it's valid
        const numberValue = Number(sample);
        if (!isNaN(numberValue) && typeof sample !== 'boolean')
            return 'numerical';
        // Try parsing as date
        if (Date.parse(sample))
            return 'date';
        // If neither number nor date, treat as categorical
        return 'categorical';
    }
    processColumnData(columnName, columnData, dataType, model) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const jsonData = yield this.fetchFromAPIWithRetry(prompt, model);
                return this.structureResponse(jsonData, dataType, dataArray);
            }
            catch (error) {
                return this.basicDataProcessing(dataArray, dataType);
            }
        });
    }
    structureResponse(response, dataType, originalData) {
        var _a, _b, _c, _d;
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response structure');
        }
        return {
            type: dataType,
            summary: response.summary || {},
            data: originalData,
            charts: {
                pieChart: ((_a = response.charts) === null || _a === void 0 ? void 0 : _a.pieChart) || [],
                donutChart: ((_b = response.charts) === null || _b === void 0 ? void 0 : _b.donutChart) || []
            },
            columnInsights: {
                summary: ((_c = response.columnInsights) === null || _c === void 0 ? void 0 : _c.summary) || "",
                keyTakeaways: ((_d = response.columnInsights) === null || _d === void 0 ? void 0 : _d.keyTakeaways) || []
            }
        };
    }
    basicDataProcessing(data, dataType) {
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
    createNumericalRanges(numbers) {
        if (numbers.length === 0)
            return [];
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
    convertToRangeObject(groupedData) {
        const rangeObject = {};
        for (const [range, count] of Object.entries(groupedData)) {
            const [start, end] = range.split('-').map(Number);
            rangeObject[range] = { start, end, count };
        }
        return rangeObject;
    }
    groupCategoricalData(data) {
        const initial = data.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
        const total = Object.values(initial).reduce((a, b) => a + b, 0);
        const threshold = total * 0.05;
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
    extractChartData(scaledData) {
        const chartData = {};
        for (const [key, data] of Object.entries(scaledData)) {
            chartData[key] = {
                type: data.type,
                pieChart: data.charts.pieChart,
                donutChart: data.charts.donutChart
            };
        }
        return chartData;
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
    // In the analyticsController.js file
    // Add this new method to the AnalyticsController class
    getAllAnalytics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analytics = yield analyticsModel_1.default.find({});
                res.status(200).json(analytics);
            }
            catch (error) {
                console.error('Error fetching all analytics:', error);
                res.status(500).json({ error: 'Error fetching analytics' });
            }
        });
    }
    // In the analyticsController.js file
    // Add this new method to the AnalyticsController class
    getAnalyticsByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const analytics = yield analyticsModel_1.default.find({ userId });
                res.status(200).json(analytics);
            }
            catch (error) {
                console.error(`Error fetching analytics for userId ${userId}:`, error);
                res.status(500).json({ error: 'Error fetching analytics' });
            }
        });
    }
}
exports.default = new AnalyticsController();

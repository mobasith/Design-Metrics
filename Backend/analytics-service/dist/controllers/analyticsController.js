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
            const mongoId = req.body.mongoId;
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: 'API_KEY is not defined in environment variables' });
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
                                const jsonData = yield fetchFromAPIWithRetry(prompt, model);
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
                    processedData: scaledData,
                    createdAt: new Date(),
                });
                yield analyticsEntry.save();
                res.status(200).json({ message: 'Feedback processed and saved successfully', scaledData });
            }
            catch (error) {
                console.error('Error in uploadFeedback:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    detectDataType(data) {
        // Ensure data is an array
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
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];
        const cleanData = dataArray.filter(item => item !== null && item !== undefined);
        switch (dataType) {
            case 'numerical': {
                const numbers = cleanData.map(Number).filter(n => !isNaN(n));
                const sum = numbers.reduce((a, b) => a + b, 0);
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
                const frequencyMap = cleanData.reduce((acc, val) => {
                    acc[val] = (acc[val] || 0) + 1;
                    return acc;
                }, {});
                const sortedEntries = Object.entries(frequencyMap)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10);
                const mostCommon = sortedEntries.reduce((obj, [key, value]) => {
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
    createPrompt(columnName, columnData, dataType) {
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
    structureResponse(response, dataType) {
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response structure');
        }
        const requiredFields = ['type', 'summary', 'visualizationReady'];
        if (!requiredFields.every(field => field in response)) {
            throw new Error('Missing required fields in response');
        }
        return response;
    }
}
function fetchFromAPIWithRetry(prompt_1, model_1) {
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
exports.default = new AnalyticsController();

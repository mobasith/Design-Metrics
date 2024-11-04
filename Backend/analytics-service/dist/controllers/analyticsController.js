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
                        if (Array.isArray(columnData) && columnData.length > 500) {
                            const prompt = this.createPrompt(key, columnData);
                            try {
                                const jsonData = yield fetchFromAPIWithRetry(prompt, model);
                                console.log(`Transformed data for column ${key}:`, jsonData);
                                scaledData[key] = jsonData;
                            }
                            catch (apiError) {
                                console.error(`API request failed for ${key}:`, apiError.message);
                                scaledData[key] = columnData; // Fallback to original data
                            }
                        }
                        else {
                            scaledData[key] = columnData; // Directly assign if not large data
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
    createPrompt(columnName, columnData) {
        return `
Please process and summarize the following data. Return the results in JSON format with the transformed values for the field.

    Remove any null or empty values from the column.
    For numerical data (more than 500 entries), provide the following statistics:
        Average
        Sum
        Minimum
        Maximum
        Median
    For categorical data, summarize with counts for each unique category.
    For date columns, standardize the format to YYYY-MM-DD.

Input Column: ${columnName} Data: ${JSON.stringify(columnData)}

Return only the transformed data in JSON format, with each column populated with cleaned or summarized values.`;
    }
}
function fetchFromAPIWithRetry(prompt_1, model_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, model, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                const apiResponse = yield model.generateContent(prompt);
                // Log the API response object for debugging
                console.log("API Response Object:", apiResponse);
                // Extract response text properly
                const responseText = yield apiResponse.response.text();
                console.log("Raw Gemini API response:", responseText); // Log the raw response for debugging
                // Check if response is valid JSON
                try {
                    const jsonData = JSON.parse(responseText);
                    console.log("Parsed JSON Data:", jsonData); // Log parsed data to confirm structure
                    return jsonData;
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
                    delay *= 2; // Exponential backoff
                }
                else {
                    throw new Error("API request failed after multiple attempts");
                }
            }
        }
    });
}
exports.default = new AnalyticsController();

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
                for (const column in feedbackData) {
                    const columnData = feedbackData[column];
                    if (columnData.length > 500) {
                        const prompt = `
                    Please summarize the values in each column by aggregating the values, by calculating the averages , sums , or other statistics to reduce the volume of the data.
                    Return the scaled data in JSON format.
                    Column: ${column}
                    Data: ${JSON.stringify(columnData)}.
                    Don't provide any additional information`;
                        try {
                            const apiResponse = yield fetchFromAPIWithRetry(prompt, model);
                            const responseText = apiResponse.response.text();
                            console.log(`Gemini API response for ${column}:`, responseText);
                            try {
                                scaledData[column] = JSON.parse(responseText);
                            }
                            catch (parseError) {
                                console.error(`Failed to parse response for ${column}:`, responseText);
                                scaledData[column] = [];
                            }
                        }
                        catch (apiError) {
                            console.error(`API request failed for ${column}:`, apiError);
                            scaledData[column] = columnData;
                        }
                    }
                    else {
                        scaledData[column] = columnData;
                    }
                }
                // Store the processed data in the database
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
}
function fetchFromAPIWithRetry(prompt_1, model_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, model, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                const apiResponse = yield model.generateContent(prompt);
                return apiResponse;
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

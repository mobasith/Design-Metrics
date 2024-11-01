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
const axios_1 = __importDefault(require("axios"));
const generative_ai_1 = require("@google/generative-ai");
class AnalyticsController {
    uploadFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //const designId = parseInt(req.body.designId, 10);
            const mongoId = req.body.mongoId;
            // if (isNaN(designId)) {
            //     return res.status(400).send('Invalid designId provided.');
            // }
            // if (isNaN(mongoId)) {
            //     return res.status(400).send('Invalid mongoId provided.');
            // }
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: 'API_KEY is not defined in environment variables' });
            }
            try {
                // Fetch feedback data from feedback-service
                const feedbackServiceURL = `http://localhost:3001/api/feedback/feedback/mongoId/${mongoId}`;
                const { data: feedbackData } = yield axios_1.default.get(feedbackServiceURL);
                console.log('Feedback data received:', feedbackData); // Log feedback data
                // Check if data needs scaling (e.g., if rows are too large)
                const scaledData = {};
                const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                for (const column in feedbackData) {
                    const columnData = feedbackData[column];
                    if (columnData.length > 1000) { // Adjust threshold as needed
                        const prompt = `Scale the data values for the column ${column}: ${JSON.stringify(columnData)}`;
                        const apiResponse = yield model.generateContent(prompt);
                        console.log('Gemini API response:', apiResponse.response.text()); // Log the response
                        const responseText = apiResponse.response.text();
                        try {
                            scaledData[column] = JSON.parse(responseText); // Safely parse the JSON
                        }
                        catch (e) {
                            console.error('Failed to parse API response:', responseText);
                            scaledData[column] = []; // Fallback
                        }
                    }
                    else {
                        scaledData[column] = columnData;
                    }
                }
                // Continue with saving analyticsEntry and generating PDF as before...
            }
            catch (error) {
                console.error('Error in uploadFeedback:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
}
;
exports.default = new AnalyticsController();

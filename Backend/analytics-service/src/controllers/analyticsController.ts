import { Request, Response } from 'express';
import AnalyticsModel from '../model/analyticsModel';
import axios from 'axios';
import { generatePDFReport } from '../utils/pdfGenerator';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

            const scaledData: { [key: string]: any[] } = {};
            const genAI = new GoogleGenerativeAI(apiKey);
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
                        const apiResponse = await fetchFromAPIWithRetry(prompt, model);
                        const responseText = apiResponse.response.text();
                        console.log(`Gemini API response for ${column}:`, responseText);

                        try {
                            scaledData[column] = JSON.parse(responseText);
                        } catch (parseError) {
                            console.error(`Failed to parse response for ${column}:`, responseText);
                            scaledData[column] = [];
                        }
                    } catch (apiError) {
                        console.error(`API request failed for ${column}:`, apiError);
                        scaledData[column] = columnData;
                    }
                } else {
                    scaledData[column] = columnData;
                }
            }

            // Store the processed data in the database
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
}

async function fetchFromAPIWithRetry(prompt: string, model: any, retries: number = 3, delay: number = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const apiResponse = await model.generateContent(prompt);
            return apiResponse;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;  // Exponential backoff
            } else {
                throw new Error("API request failed after multiple attempts");
            }
        }
    }
}


export default new AnalyticsController();


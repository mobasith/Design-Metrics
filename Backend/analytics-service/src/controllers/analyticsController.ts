import { Request, Response } from 'express';
import AnalyticsModel from '../model/analyticsModel';
import axios from 'axios';
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

            const scaledData: { [key: string]: any } = {};
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            if (feedbackData && typeof feedbackData === 'object') {
                for (const key in feedbackData) {
                    const columnData = feedbackData[key];
                    console.log(`Processing column: ${key}, Column Data:`, columnData);

                    if (Array.isArray(columnData) && columnData.length > 500) {
                        const prompt = this.createPrompt(key, columnData);

                        try {
                            const jsonData = await fetchFromAPIWithRetry(prompt, model);
                            console.log(`Transformed data for column ${key}:`, jsonData);
                            scaledData[key] = jsonData;
                        } catch (apiError: any) {
                            console.error(`API request failed for ${key}:`, apiError.message);
                            scaledData[key] = columnData; // Fallback to original data
                        }
                    } else {
                        scaledData[key] = columnData; // Directly assign if not large data
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

    private createPrompt(columnName: string, columnData: any[]): string {
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

async function fetchFromAPIWithRetry(prompt: string, model: any, retries: number = 3, delay: number = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const apiResponse = await model.generateContent(prompt);
            // Log the API response object for debugging
            console.log("API Response Object:", apiResponse);

            // Extract response text properly
            const responseText = await apiResponse.response.text();
            console.log("Raw Gemini API response:", responseText); // Log the raw response for debugging

            // Check if response is valid JSON
            try {
                const jsonData = JSON.parse(responseText);
                console.log("Parsed JSON Data:", jsonData); // Log parsed data to confirm structure
                return jsonData;
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
                delay *= 2; // Exponential backoff
            } else {
                throw new Error("API request failed after multiple attempts");
            }
        }
    }
}

export default new AnalyticsController();

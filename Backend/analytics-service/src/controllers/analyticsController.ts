import { Request, Response } from 'express';
import AnalyticsModel from '../model/analyticsModel';
import axios from 'axios';
import { generatePDFReport } from '../utils/pdfGenerator';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

class AnalyticsController {
    async uploadFeedback(req: Request, res: Response) {
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
            const { data: feedbackData } = await axios.get(feedbackServiceURL);
            console.log('Feedback data received:', feedbackData); // Log feedback data
        
            // Check if data needs scaling (e.g., if rows are too large)
            const scaledData: { [key: string]: any[] } = {};
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
            for (const column in feedbackData) {
                const columnData = feedbackData[column];
                if (columnData.length > 1000) {  // Adjust threshold as needed
                    const prompt = `Scale the data values for the column ${column}: ${JSON.stringify(columnData)}`;
                    const apiResponse = await model.generateContent(prompt);
                    console.log('Gemini API response:', apiResponse.response.text()); // Log the response
        
                    const responseText = apiResponse.response.text();
                    try {
                        scaledData[column] = JSON.parse(responseText);  // Safely parse the JSON
                    } catch (e) {
                        console.error('Failed to parse API response:', responseText);
                        scaledData[column] = [];  // Fallback
                    }
                } else {
                    scaledData[column] = columnData;
                }
            }
        
            // Continue with saving analyticsEntry and generating PDF as before...
        } catch (error: any) {
            console.error('Error in uploadFeedback:', error);
            res.status(500).json({ error: error.message });
        }
        
    }
};

export default new AnalyticsController();

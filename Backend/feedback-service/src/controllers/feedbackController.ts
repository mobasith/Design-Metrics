import { Request, Response } from 'express';
import FeedbackModel from '../models/feedbackModel';
import axios from 'axios';
import XLSX from 'xlsx';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Interfaces
interface JwtPayload {
    userId: number;
    userName: string;
    email: string;
    roleId: string;
}

// Environment configuration check
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('WARNING: JWT_SECRET is not set in environment variables');
}

// Create new feedback
export const create = async (req: Request, res: Response) => {
    try {
        const feedback = new FeedbackModel(req.body);
        await feedback.save();
        return res.status(201).json(feedback);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message || "Feedback not saved" });
        }
        return res.status(500).json({ error: "Feedback not saved" });
    }
};

// Get all feedback entries
export const getAll = async (req: Request, res: Response) => {
    try {
        const allFeedback = await FeedbackModel.find();
        return res.status(200).json(allFeedback);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message || "Error in getting all feedbacks" });
        }
        return res.status(500).json({ error: "Error in getting all feedbacks" });
    }
};

// Get feedback by ID
export const getFeedbackById = async (req: Request, res: Response) => {
    try {
        const feedback = await FeedbackModel.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        return res.status(200).json(feedback);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message || "Error in getting feedback by ID" });
        }
        return res.status(500).json({ error: "Error in getting feedback by ID" });
    }
};

// Update feedback by ID
export const updateFeedback = async (req: Request, res: Response) => {
    try {
        const feedback = await FeedbackModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!feedback) {
            return res.status(404).json({ message: "Feedback you're looking for is not found" });
        }
        
        return res.status(200).json(feedback);
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message || "Error in updating feedback" });
        }
        return res.status(500).json({ error: "Error in updating feedback" });
    }
};

// Delete feedback by ID
export const remove = async (req: Request, res: Response) => {
    try {
        const feedback = await FeedbackModel.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        return res.status(200).json({ message: "Feedback deleted" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An error occurred while deleting feedback" });
    }
};

// Get feedback by design ID
export const getFeedbackByDesignId = async (req: Request, res: Response) => {
    const { designId } = req.params;

    try {
        const feedbacks = await FeedbackModel.find({ design_id: designId });
        if (feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this design ID.' });
        }
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback by design ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching feedback.', error });
    }
};

// Upload feedback with Excel file
export const uploadFeedback = async (req: Request, res: Response) => {
    try {
        // Validate file upload
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate description
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        // Extract and verify JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        
        try {
            // Verify JWT token
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not configured');
            }

            const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
            const userId:any = decodedToken.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Invalid token: userId not found in payload' });
            }

            // Read Excel file
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheetData: unknown[][] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            // Process Excel data
            const headers: string[] = sheetData[0] as string[];
            const rows: any[][] = sheetData.slice(1) as any[][];

            // Group values by column
            const groupedData: { [key: string]: any[] } = {};
            headers.forEach((header, index) => {
                groupedData[header] = rows.map((row: any[]) => row[index]);
            });

            // Add metadata
            groupedData['description'] = description;
            groupedData['userId'] = userId;

            // Store feedback data
            const feedback = new FeedbackModel(groupedData);
            await feedback.save();

            // Send to analytics service
            try {
                await axios.post('http://localhost:3003/api/analytics/upload', {
                    mongoId: feedback._id,
                    userId: userId
                });
            } catch (analyticsError) {
                console.error('Error sending data to analytics service:', analyticsError);
                // Continue execution even if analytics service fails
            }

            return res.status(201).json({ 
                message: 'Data uploaded and sent for analysis successfully', 
                data: groupedData,
                feedbackId: feedback._id 
            });

        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError);
            return res.status(401).json({ 
                error: 'Invalid authorization token',
                details: process.env.NODE_ENV === 'development' ? (jwtError as Error).message : undefined
            });
        }

    } catch (error) {
        console.error('Error uploading feedback:', error);
        return res.status(500).json({ error: 'Failed to upload feedback' });
    }
};

// Get feedback by MongoDB ID
export const getFeedbackByMongoId = async (req: Request, res: Response) => {
    const { mongoId } = req.params;

    try {
        const feedback = await FeedbackModel.findById(mongoId);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found with the provided MongoDB ID" });
        }
        return res.status(200).json(feedback);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message || "Error in getting feedback by MongoDB ID" });
        }
        return res.status(500).json({ error: "Error in getting feedback by MongoDB ID" });
    }
};

// Get description by MongoDB ID
export const getDescriptionByMongoId = async (req: Request, res: Response): Promise<any> => {
    const { mongoId } = req.params;

    try {
        const feedback = await FeedbackModel.findById(mongoId, { description: 1, _id: 0 });
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found with the provided MongoDB ID" });
        }
        return res.status(200).json(feedback);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message || "Error in getting description by MongoDB ID" });
        }
        return res.status(500).json({ error: "Error in getting description by MongoDB ID" });
    }
};
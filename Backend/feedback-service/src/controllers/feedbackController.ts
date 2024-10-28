import { Request, Response } from 'express';
import FeedbackModel from '../models/feedbackModel';
import exp from 'constants';

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

// modify the feedback by Id

export const updateFeedback = async (req: Request, res: Response) => {
    try {
        const feedback = await FeedbackModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!feedback) {
            return res.status(404).json({ message: "Feedback ypur looking is not found" });
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

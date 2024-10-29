import { Router, Request, Response } from 'express';
import * as FeedbackController from '../controllers/feedbackController';

const router = Router();

// Create new feedback
router.post('/', (req: Request, res: Response) => FeedbackController.create(req, res) as any);

// Get all feedback
router.get('/', (req: Request, res: Response) => FeedbackController.getAll(req, res) as any);

// Get feedback by ID
router.get('/:id', (req: Request, res: Response) => FeedbackController.getFeedbackById(req, res) as any);

// Update feedback by ID
router.put('/:id', (req: Request, res: Response) => FeedbackController.updateFeedback(req, res) as any);

// Delete feedback by ID
router.delete('/:id', (req: Request, res: Response) => FeedbackController.remove(req, res) as any);

// New endpoint to get feedback by design ID
router.get('/design/:designId', (req: Request, res: Response) => FeedbackController.getFeedbackByDesignId(req, res) as any);


export default router;

import { Router, Request, Response } from 'express';
import * as FeedbackController from '../controllers/feedbackController';

import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Create new feedback
//router.post('/', (req: Request, res: Response) => FeedbackController.create(req, res) as any);

// Get all feedback
router.get('/', (req: Request, res: Response) => FeedbackController.getAll(req, res) as any);

// Get feedback by ID
router.get('/:id', (req: Request, res: Response) => FeedbackController.getFeedbackById(req, res) as any);

// Update feedback by ID
router.put('/:id', (req: Request, res: Response) => FeedbackController.updateFeedback(req, res) as any);

// Delete feedback by ID
router.delete('/:id', (req: Request, res: Response) => FeedbackController.remove(req, res) as any);

// New endpoint to get feedback by design ID (!!!)
router.get('/design/:designId', (req: Request, res: Response) => FeedbackController.getFeedbackByDesignId(req, res) as any);


// Upload Excel file and parse it
router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    FeedbackController.uploadFeedback(req, res);
});

//get a feedback by mongo id
router.get('/feedback/mongoId/:mongoId', (req:Request,res: Response) => FeedbackController.getFeedbackByMongoId(req, res) as any);

export default router;

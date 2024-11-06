import { Router, Request, Response } from 'express';
import AnalyticsController from '../controllers/analyticsController';
import multer from 'multer';

import FeedbackModel from '../model/feedbackModel';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Configure storage location for uploaded files

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    AnalyticsController.uploadFeedback(req, res);
});

// New routes
router.get('/all', (req: Request, res: Response) => {
    AnalyticsController.getAllAnalytics(req, res);
});

router.get('/user/:userId', (req: Request, res: Response) => {
    AnalyticsController.getAnalyticsByUserId(req, res);
});





export default router;

import { Router, Request, Response } from 'express';
import AnalyticsController from '../controllers/analyticsController';
import multer from 'multer';

import FeedbackModel from '../model/feedbackModel';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Configure storage location for uploaded files

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    AnalyticsController.uploadFeedback(req, res);
});

//endpoint to fetch feedbacks from feedback-service
// router.get('/feedback/:designId', async (req: Request, res: Response) => {
//     try {
//         const designId = parseInt(req.params.designId, 10);
//         const feedbackData = await FeedbackModel.find({ designId });
//         res.json(feedbackData);
//     } catch (error:any) {
//         res.status(500).json({ error: error.message });
//     }
// });



export default router;

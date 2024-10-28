import { Router, Request, Response } from 'express';
import AnalyticsController from '../controllers/analyticsController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Configure storage location for uploaded files

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    AnalyticsController.uploadFeedback(req, res);
});

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = __importDefault(require("../controllers/analyticsController"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Configure storage location for uploaded files
router.post('/upload', upload.single('file'), (req, res) => {
    analyticsController_1.default.uploadFeedback(req, res);
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
exports.default = router;

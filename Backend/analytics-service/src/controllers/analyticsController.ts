import { Request, Response } from 'express';
import AnalyticsModel from '../model/analyticsModel';
import { parseExcel } from '../utils/excelParser';
import { generatePDFReport } from '../utils/pdfGenerator';
import fs from 'fs';

class AnalyticsController {
    async uploadFeedback(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const designId = parseInt(req.body.designId, 10);
        try {
            const feedbackData = parseExcel(req.file.path);
            const totalFeedbackCount = feedbackData.length;

            let totalRating = 0;
            let positiveFeedbackCount = 0;
            let negativeFeedbackCount = 0;
            const comments: string[] = [];

            feedbackData.forEach((feedback: any) => {
                totalRating += feedback.rating; // Assuming feedback has a `rating` field
                if (feedback.comment) {
                    comments.push(feedback.comment);
                }
                if (feedback.rating >= 4) {
                    positiveFeedbackCount++;
                } else {
                    negativeFeedbackCount++;
                }
            });

            const averageRating = totalRating / totalFeedbackCount;

            const analyticsData = {
                designId,
                totalFeedbackCount,
                averageRating,
                positiveFeedbackCount,
                negativeFeedbackCount,
                feedbackSummary: comments,
            };

            // Save analytics data to MongoDB
            await AnalyticsModel.create(analyticsData);
            
            const reportFilePath = `reports/report-${Date.now()}.pdf`;
            await generatePDFReport(analyticsData, reportFilePath);

            res.download(reportFilePath, 'analytics-report.pdf', (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error generating report');
                }
            });
        } catch (error:any) {
            res.status(500).json({ error: error.message });
        } finally {
            // Cleanup uploaded file
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete uploaded file:', err);
            });
        }
    }
}

export default new AnalyticsController();

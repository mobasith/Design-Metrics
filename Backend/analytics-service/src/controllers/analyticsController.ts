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
        if (isNaN(designId)) {
            return res.status(400).send('Invalid designId provided.');
        }
    
        try {
            const feedbackData = parseExcel(req.file.path);
            console.log('Parsed Feedback Data:', feedbackData); // Log parsed data
    
            let totalRating = 0;
            let positiveFeedbackCount = 0;
            let negativeFeedbackCount = 0;
            const comments: string[] = [];
    
            feedbackData.forEach((feedback: any) => {
                if (typeof feedback.Rating === 'number') {  // Use correct key 'Rating'
                    totalRating += feedback.Rating;
                    if (feedback.Rating >= 4) {
                        positiveFeedbackCount++;
                    } else {
                        negativeFeedbackCount++;
                    }
                }
    
                if (feedback.Comment) {  // Use correct key 'Comment'
                    comments.push(feedback.Comment);
                    console.log('Comment added:', feedback.Comment); // Log added comment
                } else {
                    console.log('No comment found for this feedback.'); // Log if no comment
                }
            });
    
            const totalFeedbackCount = feedbackData.length;
            const averageRating = totalFeedbackCount ? totalRating / totalFeedbackCount : 0;
    
            const analyticsData = {
                designId,
                totalFeedbackCount,
                averageRating,
                positiveFeedbackCount,
                negativeFeedbackCount,
                feedbackSummary: comments,
            };
    
            console.log('Analytics Data before PDF generation:', analyticsData); // Log analytics data
    
            // Save analytics data to MongoDB
            await AnalyticsModel.create(analyticsData);
    
            const reportFilePath = `uploads/report-${Date.now()}.pdf`;
            await generatePDFReport(analyticsData, reportFilePath);
    
            // Send the PDF for download
            res.download(reportFilePath, 'analytics-report.pdf', (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error generating report');
                }
            });
        } catch (error: any) {
            console.error('Error in uploadFeedback:', error); // Log any errors
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

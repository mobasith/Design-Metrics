"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analyticsModel_1 = __importDefault(require("../model/analyticsModel"));
const excelParser_1 = require("../utils/excelParser");
const pdfGenerator_1 = require("../utils/pdfGenerator");
const fs_1 = __importDefault(require("fs"));
class AnalyticsController {
    uploadFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }
            const designId = parseInt(req.body.designId, 10);
            try {
                const feedbackData = (0, excelParser_1.parseExcel)(req.file.path);
                const totalFeedbackCount = feedbackData.length;
                let totalRating = 0;
                let positiveFeedbackCount = 0;
                let negativeFeedbackCount = 0;
                const comments = [];
                feedbackData.forEach((feedback) => {
                    totalRating += feedback.rating; // Assuming feedback has a `rating` field
                    if (feedback.comment) {
                        comments.push(feedback.comment);
                    }
                    if (feedback.rating >= 4) {
                        positiveFeedbackCount++;
                    }
                    else {
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
                yield analyticsModel_1.default.create(analyticsData);
                const reportFilePath = `reports/report-${Date.now()}.pdf`;
                yield (0, pdfGenerator_1.generatePDFReport)(analyticsData, reportFilePath);
                res.download(reportFilePath, 'analytics-report.pdf', (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error generating report');
                    }
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
            finally {
                // Cleanup uploaded file
                fs_1.default.unlink(req.file.path, (err) => {
                    if (err)
                        console.error('Failed to delete uploaded file:', err);
                });
            }
        });
    }
}
exports.default = new AnalyticsController();

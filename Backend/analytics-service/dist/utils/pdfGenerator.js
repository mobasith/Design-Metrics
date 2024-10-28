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
exports.generatePDFReport = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const generatePDFReport = (analyticsData, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new pdfkit_1.default();
    doc.pipe(fs_1.default.createWriteStream(outputPath));
    doc.fontSize(25).text('Analytics Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Design ID: ${analyticsData.designId}`);
    doc.text(`Total Feedback Count: ${analyticsData.totalFeedbackCount}`);
    doc.text(`Average Rating: ${analyticsData.averageRating}`);
    doc.text(`Positive Feedback Count: ${analyticsData.positiveFeedbackCount}`);
    doc.text(`Negative Feedback Count: ${analyticsData.negativeFeedbackCount}`);
    doc.moveDown();
    doc.text('Feedback Summary:');
    analyticsData.feedbackSummary.forEach((comment) => {
        doc.text(`- ${comment}`);
    });
    doc.end();
});
exports.generatePDFReport = generatePDFReport;

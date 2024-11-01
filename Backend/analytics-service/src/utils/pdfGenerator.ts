import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generatePDFReport = async (analyticsData: any, outputPath: string) => {
    return new Promise<void>((resolve, reject) => {
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(outputPath))
            .on('finish', () => {
                resolve(); // Resolve the promise when done
            })
            .on('error', (err) => {
                reject(err); // Reject the promise on error
            });

        doc.fontSize(25).text('Analytics Report', { align: 'center' });
        doc.moveDown();
        
        // doc.fontSize(16).text(`Design ID: ${analyticsData.designId}`);
        // doc.text(`Total Feedback Count: ${analyticsData.totalFeedbackCount}`);
        // doc.text(`Average Rating: ${analyticsData.averageRating}`);
        // doc.text(`Positive Feedback Count: ${analyticsData.positiveFeedbackCount}`);
        // doc.text(`Negative Feedback Count: ${analyticsData.negativeFeedbackCount}`);
        // doc.moveDown();
        
        // doc.text('Feedback Summary:');
        // analyticsData.feedbackSummary.forEach((comment: string) => {
        //     doc.text(`- ${comment}`);
        // });

        doc.end(); // Finalize the PDF document
    });
};

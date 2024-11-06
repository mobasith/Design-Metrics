import mongoose, { Document, Schema } from 'mongoose';

interface IAnalytics extends Document {
    mongoId: string;
    userId: number;
    processedData: {
        [key: string]: any;
    };
    insights: {
        summary: string;
        keyTakeaways: string[];
    };
    createdAt: Date;
    [key: string]: any; // Keep flexibility for additional fields
}

const analyticsSchema: Schema = new Schema({
    mongoId: { type: String, required: true },
    userId: { type: Number, required: true },
    processedData: { type: Schema.Types.Mixed, required: true },
    insights: {
        summary: { type: String },
        keyTakeaways: [{ type: String }]
    },
    createdAt: { type: Date, default: Date.now }
}, { strict: false }); // Keep strict: false for flexibility

const AnalyticsModel = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
export default AnalyticsModel;
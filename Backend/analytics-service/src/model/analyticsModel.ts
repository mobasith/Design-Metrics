import mongoose, { Document, Schema } from 'mongoose';

interface IAnalytics extends Document {
    mongoId: string;
    userId: number;
    processedData: {
        [key: string]: any;
    };
    createdAt: Date;
    [key: string]: any; // Keep flexibility for additional fields
}

const analyticsSchema: Schema = new Schema({
    mongoId: { type: String, required: true },
    userId: { type: Number, required: true },
    processedData: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now }
}, { strict: false }); // Keep strict: false for flexibility

const AnalyticsModel = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
export default AnalyticsModel;
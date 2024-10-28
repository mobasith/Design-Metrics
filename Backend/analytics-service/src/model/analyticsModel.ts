import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
    designId: number;
    totalFeedbackCount: number;
    averageRating: number;
    positiveFeedbackCount: number;
    negativeFeedbackCount: number;
    feedbackSummary: string[];
    createdAt: Date;
}

const analyticsSchema: Schema = new Schema({
    designId: { type: Number, required: true },
    totalFeedbackCount: { type: Number, required: true },
    averageRating: { type: Number, required: true },
    positiveFeedbackCount: { type: Number, required: true },
    negativeFeedbackCount: { type: Number, required: true },
    feedbackSummary: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);

import mongoose, { Document, Schema } from 'mongoose';

interface IAnalytics extends Document {
    [key: string]: any; // Allow dynamic keys
}

const analyticsSchema: Schema = new Schema({}, { strict: false }); // Allow dynamic fields

const AnalyticsModel = mongoose.model<IAnalytics>('Analytics', analyticsSchema);

export default AnalyticsModel;

import mongoose, { Schema, Document } from 'mongoose';

interface IFeedback extends Document {
    [key: string]: any; // Allow dynamic keys
}

const feedbackSchema: Schema = new Schema({}, { strict: false }); // Use `strict: false` for flexible fields

const FeedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default FeedbackModel;

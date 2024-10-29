import mongoose, { Schema, Document } from 'mongoose';

interface IFeedback extends Document {
    design_id: number;
    user_id: number;
    rating: number;
    comment?: string;
    created_at: Date;
}

const feedbackSchema: Schema = new Schema({
    design_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String,required: true},
    created_at: { type: Date, default: Date.now }
});

const FeedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default FeedbackModel;

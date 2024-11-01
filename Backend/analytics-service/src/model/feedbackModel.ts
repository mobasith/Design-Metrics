// src/models/feedbackModel.ts
import { Schema, model, Document } from 'mongoose';

interface Feedback extends Document {
    designId: number;
    [key: string]: any;  // Allows additional arbitrary fields
}

const FeedbackSchema = new Schema<Feedback>(
    {
        designId: { type: Number, required: true },
        data: { type: Schema.Types.Mixed },  // `data` field to store arbitrary column data
    },
    {
        strict: false,  // Allow fields not defined in the schema
        timestamps: true  // Optional: Adds `createdAt` and `updatedAt` fields
    }
);

export default model<Feedback>('Feedback', FeedbackSchema);

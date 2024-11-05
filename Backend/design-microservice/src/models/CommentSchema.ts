import mongoose, { Document } from 'mongoose';

interface IComment extends Document {
    designId: number;  // Adjust the type to match the type used in your Design model
    userId: number;
    userName: string;
    commentText: string;
    createdAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
    designId: { type: Number, required: true }, // Ensure this matches your designId type
    userId: { type: Number, required: true },
    userName: { type: String, required: true },
    commentText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    userId: number;
    userName: string;
    email: string;
    password: string;
    roleId: number;
}

const UserSchema: Schema = new Schema({
    userId: { type: Number, required: true, unique: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleId: { type: Number, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);

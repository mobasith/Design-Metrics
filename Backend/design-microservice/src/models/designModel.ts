import mongoose, { Document } from 'mongoose';

interface IDesign extends Document {
  designId: number;
  designInput: string; // Store file path or URL
  designTitle: string;
  description?: string;
  createdById: number;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const designSchema = new mongoose.Schema<IDesign>({
  designId: { type: Number, required: true, unique: true },
  designInput: { type: String, required: true },
  designTitle: { type: String, required: true },
  description: { type: String },
  createdById: { type: Number, required: true },
  createdByName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Design = mongoose.model<IDesign>('Design', designSchema);
export default Design;

import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  userId: mongoose.Types.ObjectId;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UrlSchema = new Schema<IUrl>(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const UrlModel = mongoose.model<IUrl>('Url', UrlSchema);

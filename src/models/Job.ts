import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IJob extends Document {
    _id: Types.ObjectId;
    jobId: string;
    title: string;
    description: string;
    url: string;
    location: string;
    company: string;
    datePosted: Date;
    sourceUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
    {
        jobId: { type: String, unique: true, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        url: { type: String, required: true },
        location: { type: String, required: true },
        company: { type: String, required: true },
        datePosted: { type: Date, required: true },
        sourceUrl: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);


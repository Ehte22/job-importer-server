import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IImportLog extends Document {
    _id: Types.ObjectId;
    timestamp: Date;
    sourceUrl: string;
    totalFetched: number;
    totalImported: number;
    newJobs: number;
    updatedJobs: number;
    failedJobs: {
        jobId: string;
        reason: string;
    }[];
}

const ImportLogSchema: Schema = new Schema<IImportLog>({
    timestamp: { type: Date, required: true },
    sourceUrl: { type: String, required: true },
    totalFetched: { type: Number, required: true },
    totalImported: { type: Number, required: true },
    newJobs: { type: Number, required: true },
    updatedJobs: { type: Number, required: true },
    failedJobs: [
        {
            jobId: { type: String, required: true },
            reason: { type: String, required: true },
        }
    ],
});

export default mongoose.model<IImportLog>('ImportLog', ImportLogSchema);

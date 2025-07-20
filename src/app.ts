import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import importLogRoute from './routes/importLogs.route';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/import-logs', importLogRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 Internal server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err?.message || 'Something went wrong',
    });
});

connectDB();

export default app;

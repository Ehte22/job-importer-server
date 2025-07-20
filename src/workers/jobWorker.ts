import { Worker } from 'bullmq';
import redis from '../config/redis';
import dotenv from "dotenv";
import { processJob } from "../services/jobImport.service";
import logger from '../utils/logger';

dotenv.config();

export const startWorker = () => {
    const worker = new Worker(
        'job-importer-queue',
        async (job) => {
            const { job: jobData, sourceUrl, importId } = job.data;
            await processJob(jobData, sourceUrl, importId);
        },
        {
            connection: redis,
            concurrency: Number(process.env.CONCURRENCY) || 5,
        }
    );

    worker.on('completed', (job) => {
        logger.info(`Job ${job.id} has been completed.`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${job?.id} failed: ${err.message}`);
    });
};


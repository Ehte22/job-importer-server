import cron from "node-cron";
import { fetchAndQueueJobs } from "../services/jobFetch.service";
import logger from '../utils/logger';
import { startWorker } from "../workers/jobWorker";
import config from "../config/config";

export const startJobImportCron = async () => {

    logger.info('Initial fetch and queue on app start...');
    try {
        await fetchAndQueueJobs();
    } catch (error) {
        logger.error('Error during initial fetch/queue:', error);
    }

    cron.schedule(config.jobFetch.interval, async () => {
        logger.info('Cron triggered: Fetching and queuing jobs...');

        try {
            await fetchAndQueueJobs();
        } catch (error) {
            if (error instanceof Error) {
                logger.error('Error during job fetch/queue:', error.message);
            } else {
                logger.error('Error during job fetch/queue:', String(error));
            }
        }
    });

    startWorker();
};


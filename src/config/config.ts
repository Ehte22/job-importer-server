import dotenv from "dotenv"
dotenv.config()

export enum Environment {
    Development = 'development',
    Production = 'production',
}

interface Config {
    redisUrl: string;
    mongoUrl: string;
    frontendUrl: string;
    jobFetch: {
        interval: string;
        batchSize: number;
        concurrency: number;
    };
    server: {
        port: number;
    };
    nodeEnv: string;
}

const config: Config = {
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    jobFetch: {
        interval: process.env.JOB_FETCH_INTERVAL || '0 * * * *',
        batchSize: parseInt(process.env.JOB_FETCH_BATCH_SIZE || '50'),
        concurrency: parseInt(process.env.JOB_FETCH_CONCURRENCY || '5')
    },
    server: {
        port: parseInt(process.env.PORT || '5000')
    },
    nodeEnv: process.env.NODE_ENV || Environment.Development,
};

export default config;
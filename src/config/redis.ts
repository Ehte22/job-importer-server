import { Redis } from 'ioredis'
import dotenv from "dotenv"
import logger from '../utils/logger'
import config from './config'
dotenv.config()

const redis = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null
})
// const redis = new Redis({
//     username: "default",
//     host: config.redis.host,
//     port: config.redis.port,
//     password: config.redis.password,
//     maxRetriesPerRequest: null
// });

redis.on('connect', () => {
    logger.info('Redis connected');
})

redis.on("error", (err) => {
    logger.error("Redis Client Error", err)
    process.exit(1)
})

export default redis

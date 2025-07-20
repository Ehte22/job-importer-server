import mongoose from "mongoose";
import dotenv from "dotenv"
import logger from "../utils/logger";
import config from "./config";
dotenv.config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUrl)
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        logger.error("MongoDB connection error", err)
        process.exit(1)
    }
}

export default connectDB
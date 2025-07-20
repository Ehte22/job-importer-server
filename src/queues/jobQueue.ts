import { Queue } from "bullmq"
import redis from "../config/redis"

const jobQueue = new Queue("job-importer-queue", { connection: redis })

export default jobQueue
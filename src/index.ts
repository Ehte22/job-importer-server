import dotenv from "dotenv"
dotenv.config({ path: "../.env" });
import app from "./app"
import config from "./config/config";
import { startJobImportCron } from "./cron/jobImporter.cron";

const PORT = config.server.port

app.listen(PORT, '0.0.0.0', async () => {

    startJobImportCron()
})

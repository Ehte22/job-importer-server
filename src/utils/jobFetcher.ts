import axios from "axios"
import { XMLParser } from 'fast-xml-parser';
import jobQueue from "../queues/jobQueue"
import logger from "./logger";
import ImportLog from "../models/ImportLog";

const feeds = [
    "https://jobicy.com/?feed=job_feed",
    "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
    "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
    "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
    "https://jobicy.com/?feed=job_feed&job_categories=data-science",
    "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
    "https://jobicy.com/?feed=job_feed&job_categories=business",
    "https://jobicy.com/?feed=job_feed&job_categories=management",
    "https://www.higheredjobs.com/rss/articleFeed.cfm"
]

const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true
});

export const fetchAndQueueJobs = async () => {
    for (const url of feeds) {
        console.log(url);

        try {
            const res = await axios.get(url)
            const parsed = await parser.parse(res.data)
            const items = parsed.rss?.channel?.item;

            if (items && items.length > 0) {
                logger.info(`Parsed ${items.length} jobs from ${url}`);

                const existingLog = await ImportLog.findOne({
                    sourceUrl: url,
                    timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
                });

                if (!existingLog) {

                    const importLog = await ImportLog.create({
                        timestamp: new Date(),
                        sourceUrl: url,
                        totalFetched: items.length,
                        totalImported: 0,
                        newJobs: 0,
                        updatedJobs: 0,
                        failedJobs: []
                    });

                    for (const job of items) {
                        await jobQueue.add("import-job", {
                            job,
                            sourceUrl: url,
                            importId: importLog._id.toString()
                        });
                    }
                };

            } else {
                logger.warn(`No items found in feed: ${url}`);
            }
        } catch (err) {
            logger.error(`Failed to process feed: ${url}`);
            logger.error(err instanceof Error ? err.message : String(err));
        }
    }
}



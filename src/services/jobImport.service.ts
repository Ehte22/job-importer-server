import Job from "../models/Job";
import ImportLog from "../models/ImportLog";
import logger from "../utils/logger";

export const processJob = async (jobData: any, sourceUrl: string, importId: string) => {
    const jobId = jobData.guid?.['#text'] || jobData.link;
    const title = jobData.title;
    const description = jobData.description;
    const url = jobData.link;
    const datePosted = new Date(jobData.pubDate);
    const location = jobData['job_listing:location'];
    const jobType = jobData['job_listing:job_type'];
    const company = jobData['job_listing:company'];

    const data = {
        jobId,
        title,
        description,
        url,
        datePosted,
        location,
        jobType,
        company,
        sourceUrl,
    };

    try {
        const existing = await Job.findOne({ jobId });

        if (existing) {
            await Job.updateOne({ jobId }, data);
            await ImportLog.findByIdAndUpdate(importId, {
                $inc: { updatedJobs: 1, totalImported: 1 },
            });
        } else {
            await Job.create(data);
            await ImportLog.findByIdAndUpdate(importId, {
                $inc: { newJobs: 1, totalImported: 1 },
            });
        }
    } catch (err) {
        logger.error(`Failed to import job: ${jobData.link}`);
        logger.error(err instanceof Error ? err.stack : String(err));
        await ImportLog.findByIdAndUpdate(importId, {
            $push: {
                failedJobs: {
                    jobId,
                    reason: err instanceof Error ? err.stack : String(err),
                },
            },
        });
    }
};

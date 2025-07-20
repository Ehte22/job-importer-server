import { Request, Response } from "express";
import ImportLog from "../models/ImportLog";
import logger from "../utils/logger";

export const getImportHistory = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const total = await ImportLog.countDocuments();
        const imports = await ImportLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            result: imports,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error fetching import history: ${error.message}`);
        } else {
            logger.error(`Error fetching import history: ${String(error)}`);
        }
        res.status(500).json({ error: 'Failed to fetch import history' });
    }
};

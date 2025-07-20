import { Router } from 'express';
import * as importLogController from "../controllers/importLogs.controller"

const router = Router();

router
    .get("/", importLogController.getImportHistory)

export default router;

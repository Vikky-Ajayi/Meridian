import { Router } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import aldricSubmissionsRouter from "./aldricSubmissions";
import authRouter from "./auth";

const router = Router();

router.use("/healthz", healthRouter);
router.use("/enquiries", enquiriesRouter);
router.use("/aldric-submissions", aldricSubmissionsRouter);
router.use("/auth", authRouter);

export default router;

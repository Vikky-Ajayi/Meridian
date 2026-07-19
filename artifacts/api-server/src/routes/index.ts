import { Router } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";

const router = Router();

router.use("/healthz", healthRouter);
router.use("/enquiries", enquiriesRouter);

export default router;

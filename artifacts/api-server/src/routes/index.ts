import { Router } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import aldricSubmissionsRouter from "./aldricSubmissions";
import authRouter from "./auth";
import adminRouter from "./admin";
import whatsappWebhookRouter from "./whatsappWebhook";
import emailLinksRouter from "./emailLinks";

const router = Router();

router.use("/healthz", healthRouter);
router.use("/enquiries", enquiriesRouter);
router.use("/aldric-submissions", aldricSubmissionsRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/whatsapp", whatsappWebhookRouter);
router.use("/email", emailLinksRouter);

export default router;

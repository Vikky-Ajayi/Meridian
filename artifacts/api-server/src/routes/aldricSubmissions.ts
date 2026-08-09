import { Router } from "express";
import { z } from "zod";
import { appendToSheetStrict } from "../lib/googleSheets";
import { generateReferenceNumber } from "../lib/referenceNumber";
import { logger } from "../lib/logger";

const router = Router();

const baseSubmission = z.object({
  source: z.enum(["public", "dashboard"]),
  fullName: z.string().min(1),
  contactEmail: z.string().email(),
  phoneNumber: z.string().optional().default(""),
  whatsappNumber: z.string().optional().default(""),
  dealCategory: z.string().min(1),
  geography: z.string().min(1),
  description: z.string().min(1),
  priorExperience: z.string().optional().default(""),
  agreed: z.boolean().optional().default(false),
});

const capabilitySubmission = baseSubmission.extend({
  dealSizeRange: z.string().optional().default(""),
});

const requirementSubmission = baseSubmission.extend({
  dealSize: z.string().optional().default(""),
  timeline: z.string().optional().default(""),
});

router.post("/capabilities", async (req, res) => {
  const parsed = capabilitySubmission.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("CAP");

  try {
    await appendToSheetStrict("Aldric Capabilities", [
      [
        referenceNumber,
        new Date().toISOString(),
        data.source,
        data.fullName,
        data.contactEmail,
        data.phoneNumber,
        data.whatsappNumber,
        data.dealCategory,
        data.geography,
        data.dealSizeRange,
        data.description,
        data.priorExperience,
        data.agreed ? "Yes" : "No",
      ],
    ]);
  } catch (err) {
    logger.error({ err }, "Failed to save Aldric capability to Google Sheets");
    return res.status(500).json({ error: "Failed to save submission to Google Sheets." });
  }

  return res.status(201).json({ referenceNumber, type: "capability" });
});

router.post("/requirements", async (req, res) => {
  const parsed = requirementSubmission.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("REQ");

  try {
    await appendToSheetStrict("Aldric Requirements", [
      [
        referenceNumber,
        new Date().toISOString(),
        data.source,
        data.fullName,
        data.contactEmail,
        data.phoneNumber,
        data.whatsappNumber,
        data.dealCategory,
        data.geography,
        data.dealSize,
        data.description,
        data.timeline,
        data.priorExperience,
        data.agreed ? "Yes" : "No",
      ],
    ]);
  } catch (err) {
    logger.error({ err }, "Failed to save Aldric requirement to Google Sheets");
    return res.status(500).json({ error: "Failed to save submission to Google Sheets." });
  }

  return res.status(201).json({ referenceNumber, type: "requirement" });
});

export default router;

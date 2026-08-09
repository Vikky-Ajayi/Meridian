import { Router } from "express";
import { appendToSheetStrict } from "../lib/googleSheets";
import { generateReferenceNumber } from "../lib/referenceNumber";
import { logger } from "../lib/logger";

const router = Router();

type BaseSubmission = {
  source: "public" | "dashboard";
  fullName: string;
  contactEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  dealCategory: string;
  geography: string;
  description: string;
  priorExperience: string;
  agreed: boolean;
};

type CapabilitySubmission = BaseSubmission & {
  dealSizeRange: string;
};

type RequirementSubmission = BaseSubmission & {
  dealSize: string;
  timeline: string;
};

function readString(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(body: Record<string, unknown>, key: string) {
  return body[key] === true;
}

function validateBase(body: unknown): { data?: BaseSubmission; errors?: string[] } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { errors: ["Body must be an object"] };
  }

  const record = body as Record<string, unknown>;
  const source = record["source"] === "dashboard" ? "dashboard" : "public";
  const data: BaseSubmission = {
    source,
    fullName: readString(record, "fullName"),
    contactEmail: readString(record, "contactEmail"),
    phoneNumber: readString(record, "phoneNumber"),
    whatsappNumber: readString(record, "whatsappNumber"),
    dealCategory: readString(record, "dealCategory"),
    geography: readString(record, "geography"),
    description: readString(record, "description"),
    priorExperience: readString(record, "priorExperience"),
    agreed: readBoolean(record, "agreed"),
  };

  const errors: string[] = [];
  for (const key of ["fullName", "contactEmail", "dealCategory", "geography", "description"] as const) {
    if (!data[key]) errors.push(`${key} is required`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    errors.push("contactEmail must be a valid email address");
  }

  return errors.length ? { errors } : { data };
}

function validateCapability(body: unknown): { data?: CapabilitySubmission; errors?: string[] } {
  const base = validateBase(body);
  if (!base.data) return base;
  const record = body as Record<string, unknown>;
  return {
    data: {
      ...base.data,
      dealSizeRange: readString(record, "dealSizeRange"),
    },
  };
}

function validateRequirement(body: unknown): { data?: RequirementSubmission; errors?: string[] } {
  const base = validateBase(body);
  if (!base.data) return base;
  const record = body as Record<string, unknown>;
  return {
    data: {
      ...base.data,
      dealSize: readString(record, "dealSize"),
      timeline: readString(record, "timeline"),
    },
  };
}

router.post("/capabilities", async (req, res) => {
  const parsed = validateCapability(req.body);
  if (!parsed.data) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.errors });
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
  const parsed = validateRequirement(req.body);
  if (!parsed.data) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.errors });
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

import { Router } from "express";
import { appendToSheetStrict, readSheetStrict } from "../lib/googleSheets";
import { generateReferenceNumber } from "../lib/referenceNumber";
import { logger } from "../lib/logger";

const router = Router();

function formatDisplayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapCapabilityRow(row: string[], index: number) {
  return {
    id: `cap-${index + 1}`,
    reference: row[0] ?? "",
    dateSubmitted: formatDisplayDate(row[1] ?? ""),
    source: row[2] ?? "",
    fullName: row[3] ?? "",
    contactEmail: row[4] ?? "",
    phoneNumber: row[5] ?? "",
    whatsappNumber: row[6] ?? "",
    category: row[7] ?? "",
    geography: row[8] ?? "",
    title: row[8] || row[7] || "Capability",
    dealSize: row[9] ?? "",
    description: row[10] ?? "",
    priorExperience: row[11] ?? "",
    status: "Under Review",
  };
}

function mapRequirementRow(row: string[], index: number) {
  return {
    id: `req-${index + 1}`,
    reference: row[0] ?? "",
    dateSubmitted: formatDisplayDate(row[1] ?? ""),
    source: row[2] ?? "",
    fullName: row[3] ?? "",
    contactEmail: row[4] ?? "",
    phoneNumber: row[5] ?? "",
    whatsappNumber: row[6] ?? "",
    category: row[7] ?? "",
    geography: row[8] ?? "",
    title: row[8] || row[7] || "Requirement",
    dealSize: row[9] ?? "",
    description: row[10] ?? "",
    timeline: row[11] ?? "",
    priorExperience: row[12] ?? "",
    status: "Under Review",
  };
}

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

router.get("/", async (req, res) => {
  try {
    const email = typeof req.query["email"] === "string" ? req.query["email"].toLowerCase() : "";
    const [capabilityRows, requirementRows] = await Promise.all([
      readSheetStrict("Aldric Capabilities"),
      readSheetStrict("Aldric Requirements"),
    ]);
    const capabilities = capabilityRows.map(mapCapabilityRow).filter((row) => {
      return !email || row.contactEmail.toLowerCase() === email;
    });
    const requirements = requirementRows.map(mapRequirementRow).filter((row) => {
      return !email || row.contactEmail.toLowerCase() === email;
    });

    return res.status(200).json({
      capabilities: capabilities.reverse(),
      requirements: requirements.reverse(),
    });
  } catch (err) {
    logger.error({ err }, "Failed to load Aldric submissions from Google Sheets");
    return res.status(500).json({ error: "Failed to load submissions." });
  }
});

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

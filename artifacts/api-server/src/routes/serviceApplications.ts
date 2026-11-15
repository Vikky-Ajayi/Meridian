import { randomBytes, timingSafeEqual } from "node:crypto";
import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, serviceApplicationsTable, type ServiceApplication } from "@workspace/db";
import {
  StartServiceApplicationBody,
  CompleteServiceApplicationBody,
} from "@workspace/api-zod";
import { ensureAdminTables } from "../lib/adminTables";
import { upsertSheetRowStrict } from "../lib/googleSheets";
import { generateServiceReference } from "../lib/referenceNumber";
import { serviceBySlug, sheetHeaders, STAGE_LABELS, type ServiceDef } from "../lib/serviceCatalog";
import { logger } from "../lib/logger";

// The five service forms. Step 1 (POST /applications) saves the lead straight
// away, so it isn't lost if the visitor stops; step 2
// (POST /applications/:reference/details) adds the detailed answers, or records
// that they would rather explain on a call.

const router = Router();

const SHORT = 200;
const LONG = 4000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: string | undefined, max: number) => (value ?? "").trim().slice(0, max);

const tokensMatch = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

function sheetRow(service: ServiceDef, app: ServiceApplication): string[] {
  const d = app.details ?? {};
  return [
    app.referenceNumber,
    app.submittedAt.toISOString(),
    STAGE_LABELS[app.stage] ?? app.stage,
    app.fullName,
    app.emailAddress,
    app.whatsappNumber,
    app.countryOfResidence,
    app.currency,
    app.amount,
    app.timeline,
    ...(service.extra ? [d[service.extra.key] ?? ""] : []),
    ...service.questions.map((q) => d[q.key] ?? ""),
  ];
}

/** Mirrors the row to the service's Google Sheet tab; a failure is logged, never shown to the applicant. */
function syncSheet(service: ServiceDef, app: ServiceApplication) {
  upsertSheetRowStrict(service.sheet, sheetHeaders(service), app.referenceNumber, sheetRow(service, app)).catch((err) => {
    logger.error({ err, reference: app.referenceNumber }, "Failed to write service application to Google Sheets");
  });
}

// POST /api/applications
router.post("/", async (req, res) => {
  const parsed = StartServiceApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }
  const data = parsed.data;
  const service = serviceBySlug(data.service);
  if (!service) return res.status(400).json({ error: "Unknown service." });

  const fullName = clean(data.fullName, SHORT);
  const whatsappNumber = clean(data.whatsappNumber, 40);
  const emailAddress = clean(data.emailAddress, SHORT);
  const amount = clean(data.amount, SHORT);
  if (!fullName || !whatsappNumber || !EMAIL.test(emailAddress) || !amount || !data.consent) {
    return res.status(400).json({ error: "Please complete your name, phone, email, amount and consent." });
  }

  const belowMinimum = amount.startsWith("Less than");
  const details: Record<string, string> = {};
  if (service.extra) details[service.extra.key] = clean(data.extraAnswer, SHORT);

  try {
    await ensureAdminTables();
    const [app] = await db
      .insert(serviceApplicationsTable)
      .values({
        referenceNumber: generateServiceReference(service.prefix),
        service: service.slug,
        stage: belowMinimum ? "below_minimum" : "lead",
        token: randomBytes(24).toString("hex"),
        fullName,
        emailAddress,
        whatsappNumber,
        countryOfResidence: clean(data.countryOfResidence, SHORT),
        currency: data.currency,
        amount,
        timeline: clean(data.timeline, SHORT),
        details,
      })
      .returning();
    syncSheet(service, app);
    return res.status(201).json({ referenceNumber: app.referenceNumber, token: app.token, belowMinimum });
  } catch (err) {
    logger.error({ err, service: service.slug }, "Failed to save service application lead");
    return res.status(500).json({ error: "We couldn't save your details. Please try again." });
  }
});

// POST /api/applications/:reference/details
router.post("/:reference/details", async (req, res) => {
  const parsed = CompleteServiceApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }
  const data = parsed.data;

  try {
    await ensureAdminTables();
    const [existing] = await db
      .select()
      .from(serviceApplicationsTable)
      .where(eq(serviceApplicationsTable.referenceNumber, req.params.reference));
    if (!existing || !tokensMatch(existing.token, data.token)) {
      return res.status(404).json({ error: "We couldn't find that application." });
    }
    const service = serviceBySlug(existing.service);
    if (!service) return res.status(404).json({ error: "We couldn't find that application." });

    if (existing.stage === "below_minimum") {
      return res.status(400).json({ error: "This application is below our minimum amount." });
    }
    if (data.action === "apply" && !(data.confirmsAccuracy && data.acceptsAdvisoryFee)) {
      return res.status(400).json({ error: "Please tick both confirmations before applying." });
    }

    // Keep only this service's questions; ignore anything else sent.
    const details = { ...(existing.details ?? {}) };
    if (data.action === "apply") {
      for (const q of service.questions) details[q.key] = clean(data.answers?.[q.key], LONG);
    }

    const [app] = await db
      .update(serviceApplicationsTable)
      .set({
        stage: data.action === "apply" ? "applied" : "call_requested",
        details,
        completedAt: new Date(),
      })
      .where(eq(serviceApplicationsTable.id, existing.id))
      .returning();
    syncSheet(service, app);
    return res.json({ stage: app.stage });
  } catch (err) {
    logger.error({ err, reference: req.params.reference }, "Failed to complete service application");
    return res.status(500).json({ error: "We couldn't save your answers. Please try again." });
  }
});

export default router;

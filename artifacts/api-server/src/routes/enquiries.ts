import { Router } from "express";
import { db } from "@workspace/db";
import {
  moveMoneySbmissionsTable,
  privateBankingSubmissionsTable,
  contactSubmissionsTable,
  introductionRequestsTable,
} from "@workspace/db";
import {
  SubmitMoveMoneyEnquiryBody,
  SubmitPrivateBankingEnquiryBody,
  LogBelowMinimumEnquiryBody,
  SubmitContactEnquiryBody,
  SubmitIntroductionRequestBody,
} from "@workspace/api-zod";
import { appendToSheet } from "../lib/googleSheets";
import { generateReferenceNumber } from "../lib/referenceNumber";
import { logger } from "../lib/logger";

const router = Router();

// Desk WhatsApp contact shown on the success pages. Fixed here rather than read
// from env so a stale WHATSAPP_NUMBER/WHATSAPP_LINK deployment value can't override it.
const DESK_WHATSAPP_NUMBER = "+44 7393 908896";
const DESK_WHATSAPP_LINK = "https://wa.me/message/P7FHBCAOENHQF1";

// POST /api/enquiries/move-money
router.post("/move-money", async (req, res) => {
  const parsed = SubmitMoveMoneyEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("MMA");

  try {
    await db.insert(moveMoneySbmissionsTable).values({
      referenceNumber,
      amountRange: data.amountRange,
      fundsLocation: data.fundsLocation,
      destination: data.destination,
      purpose: data.purpose,
      timeline: data.timeline,
      regulatedInstitution: data.regulatedInstitution,
      fullName: data.fullName,
      countryOfResidence: data.countryOfResidence,
      whatsappNumber: data.whatsappNumber,
      emailAddress: data.emailAddress,
    });
  } catch (err) {
    logger.error({ err }, "Failed to insert move-money enquiry into DB");
    return res.status(500).json({ error: "Failed to save enquiry. Please try again." });
  }

  // Async sync to Google Sheets (fire and forget — errors are logged, not thrown)
  appendToSheet("Move Money Abroad", [
    [
      referenceNumber,
      new Date().toISOString(),
      data.fullName,
      data.emailAddress,
      data.whatsappNumber,
      data.countryOfResidence,
      data.amountRange,
      data.fundsLocation,
      data.destination,
      data.purpose,
      data.timeline,
      data.regulatedInstitution,
    ],
  ]).catch((err) => {
    logger.error({ err }, "Failed to append move-money enquiry to Google Sheets");
  });

  return res.status(201).json({
    referenceNumber,
    fullName: data.fullName,
    type: "move-money",
    whatsappNumber: DESK_WHATSAPP_NUMBER,
    whatsappLink: DESK_WHATSAPP_LINK,
  });
});

// POST /api/enquiries/private-banking
router.post("/private-banking", async (req, res) => {
  const parsed = SubmitPrivateBankingEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("PBI");

  try {
    await db.insert(privateBankingSubmissionsTable).values({
      referenceNumber,
      bankingRelationshipType: data.bankingRelationshipType,
      investableWealth: data.investableWealth,
      jurisdictions: data.jurisdictions,
      reasons: data.reasons,
      timeline: data.timeline,
      fullName: data.fullName,
      countryOfResidence: data.countryOfResidence,
      whatsappNumber: data.whatsappNumber,
      emailAddress: data.emailAddress,
    });
  } catch (err) {
    logger.error({ err }, "Failed to insert private-banking enquiry into DB");
    return res.status(500).json({ error: "Failed to save enquiry. Please try again." });
  }

  // Async sync to Google Sheets (fire and forget — errors are logged, not thrown)
  appendToSheet("Private Banking Introductions", [
    [
      referenceNumber,
      new Date().toISOString(),
      data.fullName,
      data.emailAddress,
      data.whatsappNumber,
      data.countryOfResidence,
      data.bankingRelationshipType,
      data.investableWealth,
      data.jurisdictions.join(", "),
      data.reasons.join(", "),
      data.timeline,
    ],
  ]).catch((err) => {
    logger.error({ err }, "Failed to append private-banking enquiry to Google Sheets");
  });

  return res.status(201).json({
    referenceNumber,
    fullName: data.fullName,
    type: "private-banking",
    whatsappNumber: DESK_WHATSAPP_NUMBER,
    whatsappLink: DESK_WHATSAPP_LINK,
  });
});

// POST /api/enquiries/below-minimum
// Visitor selected "Less than £50,000": log the amount only (no contact details).
router.post("/below-minimum", async (req, res) => {
  const parsed = LogBelowMinimumEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }

  appendToSheet("Below Minimum Enquiries", [
    [new Date().toISOString(), parsed.data.amountRange],
  ]).catch((err) => {
    logger.error({ err }, "Failed to append below-minimum enquiry to Google Sheets");
  });

  return res.status(201).json({ logged: true });
});

// POST /api/enquiries/contact
router.post("/contact", async (req, res) => {
  const parsed = SubmitContactEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("CON");

  try {
    await db.insert(contactSubmissionsTable).values({
      referenceNumber,
      fullName: data.fullName,
      emailAddress: data.emailAddress,
      phoneNumber: data.phoneNumber,
      natureOfEnquiry: data.natureOfEnquiry,
      message: data.message,
    });
  } catch (err) {
    logger.error({ err }, "Failed to insert contact enquiry into DB");
    return res.status(500).json({ error: "Failed to save enquiry. Please try again." });
  }

  appendToSheet("Contact Enquiries", [
    [
      referenceNumber,
      new Date().toISOString(),
      data.fullName,
      data.emailAddress,
      data.phoneNumber,
      data.natureOfEnquiry,
      data.message,
    ],
  ]).catch((err) => {
    logger.error({ err }, "Failed to append contact enquiry to Google Sheets");
  });

  return res.status(201).json({
    referenceNumber,
    fullName: data.fullName,
    type: "contact",
    whatsappNumber: DESK_WHATSAPP_NUMBER,
    whatsappLink: DESK_WHATSAPP_LINK,
  });
});

// POST /api/enquiries/introduction-request
router.post("/introduction-request", async (req, res) => {
  const parsed = SubmitIntroductionRequestBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("PBI");

  try {
    await db.insert(introductionRequestsTable).values({
      referenceNumber,
      fullName: data.fullName,
      emailAddress: data.emailAddress,
      region: data.region,
      message: data.message || null,
    });
  } catch (err) {
    logger.error({ err }, "Failed to insert introduction request into DB");
    return res.status(500).json({ error: "Failed to save enquiry. Please try again." });
  }

  appendToSheet("Introduction Requests", [
    [
      referenceNumber,
      new Date().toISOString(),
      data.fullName,
      data.emailAddress,
      data.region,
      data.message ?? "",
    ],
  ]).catch((err) => {
    logger.error({ err }, "Failed to append introduction request to Google Sheets");
  });

  return res.status(201).json({
    referenceNumber,
    fullName: data.fullName,
    type: "introduction-request",
    whatsappNumber: DESK_WHATSAPP_NUMBER,
    whatsappLink: DESK_WHATSAPP_LINK,
  });
});

export default router;

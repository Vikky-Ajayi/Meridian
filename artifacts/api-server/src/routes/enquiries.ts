import { Router } from "express";
import { db } from "@workspace/db";
import { moveMoneySbmissionsTable, privateBankingSubmissionsTable } from "@workspace/db";
import { SubmitMoveMoneyEnquiryBody, SubmitPrivateBankingEnquiryBody } from "@workspace/api-zod";
import { appendToSheet } from "../lib/googleSheets";
import { generateReferenceNumber } from "../lib/referenceNumber";

const router = Router();

// POST /api/enquiries/move-money
router.post("/move-money", async (req, res) => {
  const parsed = SubmitMoveMoneyEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("MMA");

  // Save to DB
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

  // Async sync to Google Sheets (fire and forget style — errors are logged not thrown)
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
  ]).catch(() => {});

  return res.status(201).json({
    referenceNumber,
    fullName: data.fullName,
    type: "move-money",
    whatsappNumber: process.env.WHATSAPP_NUMBER || null,
    whatsappLink: process.env.WHATSAPP_LINK || null,
  });
});

// POST /api/enquiries/private-banking
router.post("/private-banking", async (req, res) => {
  const parsed = SubmitPrivateBankingEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const data = parsed.data;
  const referenceNumber = generateReferenceNumber("PBI");

  // Save to DB
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

  // Async sync to Google Sheets
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
  ]).catch(() => {});

  return res.status(201).json({
    referenceNumber,
    fullName: data.fullName,
    type: "private-banking",
    whatsappNumber: process.env.WHATSAPP_NUMBER || null,
    whatsappLink: process.env.WHATSAPP_LINK || null,
  });
});

export default router;

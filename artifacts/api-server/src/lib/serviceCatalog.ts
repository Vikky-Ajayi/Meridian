import type { FormType } from "./whatsappTemplates";

// The five service application forms. Question keys and wording must match the
// website's form definitions (artifacts/meridian/src/lib/services.ts); the
// labels here are what the admin dashboard and the Google Sheet show.

export interface ServiceQuestion {
  key: string;
  label: string;
}

export interface ServiceDef {
  slug: string;
  name: string;
  /** Reference number prefix. Capital movement and private banking keep MMA/PBI. */
  prefix: string;
  /** Which follow-up sequence (WhatsApp/email) approved applicants receive. */
  formType: FormType;
  /** Google Sheet tab. */
  sheet: string;
  amountLabel: string;
  timelineLabel: string;
  /** Service-specific step 1 question, if any. */
  extra?: ServiceQuestion;
  /** Step 2 questions, in form order. */
  questions: readonly ServiceQuestion[];
}

const ABOUT_YOU: readonly ServiceQuestion[] = [
  { key: "nationality", label: "Nationality" },
  { key: "occupation", label: "Occupation / business" },
];

export const SERVICES: readonly ServiceDef[] = [
  {
    slug: "large-capital-movement",
    name: "Large Capital Movement",
    prefix: "MMA",
    formType: "move-money",
    sheet: "Large Capital Movement",
    amountLabel: "Amount to move",
    timelineLabel: "When it needs to arrive",
    questions: [
      ...ABOUT_YOU,
      { key: "singleOrStaged", label: "Single or staged?" },
      { key: "fromCountryCurrency", label: "From: country and currency" },
      { key: "toCountryCurrency", label: "To: country and currency" },
      { key: "moneyFor", label: "What is the money for?" },
      { key: "receivingAccount", label: "Account to receive the funds" },
      { key: "fundsHeldNow", label: "Where the money is held now" },
      { key: "sourceOfFunds", label: "Where the money came from" },
      { key: "previousProblems", label: "Problems moving money before" },
      { key: "hardDeadline", label: "Hard deadline" },
    ],
  },
  {
    slug: "private-banking-introduction",
    name: "Private Banking Introduction",
    prefix: "PBI",
    formType: "private-banking",
    sheet: "Private Banking Applications",
    amountLabel: "Amount to deposit",
    timelineLabel: "When they want the account open",
    extra: { key: "accountType", label: "Account type" },
    questions: [
      ...ABOUT_YOU,
      { key: "preferredJurisdiction", label: "Preferred jurisdiction" },
      { key: "currencies", label: "Currencies they'll hold" },
      { key: "wantFromBank", label: "What they want from a private bank" },
      { key: "whyNow", label: "Why an offshore private bank now" },
      { key: "fundsHeldNow", label: "Where the funds are held now" },
      { key: "wealthOrigin", label: "How their wealth was built up" },
      { key: "firstDepositSource", label: "Where the first deposit comes from" },
      { key: "expectedUsage", label: "How they expect to use the account" },
      { key: "pep", label: "Politically exposed person (self or close family)" },
      { key: "existingAccounts", label: "Existing private banking / offshore accounts" },
      { key: "companyDetails", label: "Company details (corporate accounts)" },
    ],
  },
  {
    slug: "high-value-real-estate",
    name: "High Value Real Estate Purchase",
    prefix: "HRE",
    formType: "other-service",
    sheet: "Real Estate Purchase",
    amountLabel: "Purchase budget",
    timelineLabel: "When they need to complete",
    extra: { key: "whereBuying", label: "Where they are buying" },
    questions: [
      ...ABOUT_YOU,
      { key: "propertyDescription", label: "Property they're looking for" },
      { key: "buyingStage", label: "Where they are in the buying process" },
      { key: "funding", label: "How they'll fund the purchase" },
      { key: "sourceOfFunds", label: "Where the money comes from" },
      { key: "ownership", label: "Who will own the property" },
      { key: "needFromUs", label: "What they need from us" },
      { key: "complications", label: "Anything that could delay or complicate it" },
    ],
  },
  {
    slug: "trust-offshore-company",
    name: "Trust & Offshore Company",
    prefix: "TOC",
    formType: "other-service",
    sheet: "Trust & Offshore Company",
    amountLabel: "Approximate value of assets",
    timelineLabel: "When they want it set up",
    extra: { key: "structureType", label: "What they want to set up" },
    questions: [
      ...ABOUT_YOU,
      { key: "preferredJurisdiction", label: "Preferred jurisdiction" },
      { key: "needsBankAccount", label: "Structure needs its own bank account" },
      { key: "structureGoals", label: "What the structure should achieve" },
      { key: "jurisdictionReason", label: "Why that jurisdiction" },
      { key: "assets", label: "Assets to hold, and where they are now" },
      { key: "assetsOrigin", label: "How the assets were built up" },
      { key: "beneficiaries", label: "Who benefits, and who is in control" },
      { key: "existingStructures", label: "Existing trusts, companies or accounts" },
      { key: "priorAdvice", label: "Tax or legal advice in their home country" },
    ],
  },
  {
    slug: "bespoke-services",
    name: "Bespoke Services",
    prefix: "BSP",
    formType: "other-service",
    sheet: "Bespoke Services",
    amountLabel: "Approximate value involved",
    timelineLabel: "When they need it done",
    extra: { key: "category", label: "Which best describes it" },
    questions: [
      ...ABOUT_YOU,
      { key: "needDescription", label: "What they need help with" },
      { key: "countries", label: "Countries involved" },
      { key: "sourceOfWealth", label: "Where the money or wealth comes from" },
      { key: "triedSoFar", label: "What they've tried so far" },
      { key: "otherAdvisers", label: "Other advisers involved" },
      { key: "goodOutcome", label: "What a good outcome looks like" },
    ],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const STAGE_LABELS: Record<string, string> = {
  lead: "Lead only: stopped after step 1",
  applied: "Completed the full application",
  call_requested: "Asked to explain on a call",
  below_minimum: "Below the minimum amount",
};

/** Sheet columns: fixed lead columns, the step 1 extra, then the step 2 questions. */
export function sheetHeaders(service: ServiceDef): string[] {
  return [
    "Reference",
    "Submitted At",
    "Stage",
    "Full Name",
    "Email",
    "WhatsApp",
    "Country",
    "Currency",
    service.amountLabel,
    service.timelineLabel,
    ...(service.extra ? [service.extra.label] : []),
    ...service.questions.map((q) => q.label),
  ];
}

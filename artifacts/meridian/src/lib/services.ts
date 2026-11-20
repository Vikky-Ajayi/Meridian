// The five service application forms linked from the landing page. Question
// keys must match the API's catalog (artifacts/api-server/src/lib/serviceCatalog.ts),
// which labels the answers for the admin dashboard and the Google Sheet.

export type Currency = 'GBP' | 'USD';

export const CURRENCIES: readonly { value: Currency; label: string }[] = [
  { value: 'GBP', label: '£ Pounds' },
  { value: 'USD', label: '$ Dollars' },
];

/** Amount bands in the chosen currency. The first band is below our minimum (about £50,000). */
export const AMOUNT_OPTIONS: Record<Currency, readonly string[]> = {
  GBP: ['Less than £50,000', '£50k – £500k', '£500k – £1m', '£1m – £5m', '£5m – £20m', '£20m – £50m', '£50m+'],
  USD: ['Less than $65,000', '$65k – $500k', '$500k – $1m', '$1m – $5m', '$5m – $20m', '$20m – $50m', '$50m+'],
};

export const isBelowMinimum = (amount: string) => amount.startsWith('Less than');

const TIMELINE_OPTIONS = ['Within 1 month', '1–3 months', '3–6 months', '6–12 months', 'Just exploring'] as const;

export interface Field {
  key: string;
  label: string;
  kind: 'text' | 'select' | 'textarea';
  hint?: string;
  placeholder?: string;
  options?: readonly string[];
  rows?: number;
  /** Spans the full width of the section. Textareas always do. */
  full?: boolean;
}

export interface Section {
  title: string;
  fields: readonly Field[];
}

export interface Service {
  slug: string;
  name: string;
  /** Short label for the landing page's bottom CTA row. */
  shortName: string;
  cardText: string;
  title: string;
  intro: string;
  amountLabel: string;
  timelineLabel: string;
  timelineOptions: readonly string[];
  /** Service-specific step 1 question. */
  extra?: Field;
  sections: readonly Section[];
}

const ABOUT_YOU: Section = {
  title: 'A bit more about you',
  fields: [
    { key: 'nationality', label: 'Nationality', kind: 'text', placeholder: 'e.g. British' },
    { key: 'occupation', label: 'Occupation / business', kind: 'text', placeholder: 'e.g. Founder, oil & gas services' },
  ],
};

export const SERVICES: readonly Service[] = [
  {
    slug: 'large-capital-movement',
    name: 'Large Capital Movement',
    shortName: 'Large Capital Movement',
    cardText: 'Move large sums abroad through regulated channels.',
    title: 'Move your capital abroad',
    intro: 'Regulated channels, rates priced for your size, compliance ready before anything moves.',
    amountLabel: 'Amount to move',
    timelineLabel: 'When does it need to arrive?',
    timelineOptions: TIMELINE_OPTIONS,
    sections: [
      ABOUT_YOU,
      {
        title: 'The transfer',
        fields: [
          { key: 'singleOrStaged', label: 'Single or staged?', kind: 'select', options: ['One single transfer', 'Several transfers over time', 'Regular ongoing transfers', 'Not sure yet'] },
          { key: 'fromCountryCurrency', label: 'From: country and currency', kind: 'text', placeholder: 'e.g. United Kingdom, GBP' },
          { key: 'toCountryCurrency', label: 'To: country and currency', kind: 'text', placeholder: 'e.g. United Arab Emirates, USD', full: true },
          { key: 'moneyFor', label: 'What is the money for?', kind: 'textarea', rows: 4, hint: 'For example a property purchase, investment, business payments, school fees, relocation, or moving savings to a safer currency.', placeholder: 'e.g. Moving the proceeds of a business sale into dollars, and paying for a villa in Dubai.' },
          { key: 'receivingAccount', label: 'Do you already have an account to receive the funds?', kind: 'textarea', rows: 3, hint: 'Tell us the bank and country, or say if you need one opened.', placeholder: "e.g. I have a UK personal account with Barclays, but it isn't set up for transfers this large." },
        ],
      },
      {
        title: 'Source of funds',
        fields: [
          { key: 'fundsHeldNow', label: 'Where is the money held now?', kind: 'textarea', rows: 3, hint: 'Which banks, which countries, which currencies.', placeholder: 'e.g. Mostly in a UK business account with HSBC, plus a personal savings account with Barclays.' },
          { key: 'sourceOfFunds', label: 'Where did the money come from?', kind: 'textarea', rows: 5, hint: 'Business profits, salary, sale of a property or business, investments, inheritance. Be specific: this is the first thing banks check.', placeholder: 'e.g. Proceeds from selling two rental properties in Manchester in 2025, plus dividends from my company.' },
          { key: 'previousProblems', label: 'Have you had problems moving money before?', kind: 'textarea', rows: 3, hint: 'Transfers held, capped or refused, documents your bank asked for, or delays.', placeholder: "e.g. My bank held a $200k transfer for 4 weeks and asked for documents I didn't have ready." },
          { key: 'hardDeadline', label: 'Is there a hard deadline?', kind: 'textarea', rows: 3, hint: 'A completion date, a payment due, a contract deadline.', placeholder: 'e.g. Exchange of contracts on 15 January, so funds must land by 10 January.' },
        ],
      },
    ],
  },
  {
    slug: 'private-banking-introduction',
    name: 'Private Banking Introduction',
    shortName: 'Private Banking',
    cardText: 'Get introduced to regulated offshore private banks.',
    title: 'Request a private banking introduction',
    intro: 'We introduce you to regulated offshore banks offering private banking. Some pay interest on deposits, depending on the amount held.',
    amountLabel: 'Amount you plan to deposit',
    timelineLabel: 'When do you want the account open?',
    timelineOptions: TIMELINE_OPTIONS,
    extra: { key: 'accountType', label: 'Account type', kind: 'select', options: ['Personal', 'Corporate', 'Both personal and corporate', 'Trust or foundation'] },
    sections: [
      ABOUT_YOU,
      {
        title: 'The account you need',
        fields: [
          { key: 'preferredJurisdiction', label: 'Preferred jurisdiction', kind: 'select', options: ['Not sure, please advise', 'Switzerland', 'United Kingdom', 'Jersey / Guernsey', 'Luxembourg', 'UAE', 'Singapore', 'Mauritius', 'Other'] },
          { key: 'currencies', label: "Currencies you'll hold", kind: 'text', placeholder: 'e.g. USD, GBP, EUR' },
          { key: 'wantFromBank', label: 'What do you want from a private bank?', kind: 'textarea', rows: 4, hint: 'For example safe holding of funds, interest on deposits, investment management, lending against assets, multi-currency payments or a dedicated relationship manager.', placeholder: 'e.g. Somewhere stable to hold $2m in dollars, earn interest, and make regular payments to suppliers in China and the UK.' },
          { key: 'whyNow', label: 'Why are you looking for an offshore private bank now?', kind: 'textarea', rows: 3, hint: 'A recent sale, currency risk, problems with your current bank, a move abroad?', placeholder: "e.g. We want to spread our wealth across currencies, and our high-street bank can't handle large international transfers quickly." },
        ],
      },
      {
        title: 'Source of funds and activity',
        fields: [
          { key: 'fundsHeldNow', label: 'Where are the funds held now?', kind: 'textarea', rows: 3, hint: 'Which banks or countries, and in which currencies.', placeholder: 'e.g. Split between a UK bank (GBP) and a bank in Dubai (USD).' },
          { key: 'wealthOrigin', label: 'How was your wealth built up?', kind: 'textarea', rows: 5, hint: 'Business, employment, property, investments, inheritance. Banks check this carefully, so be specific.', placeholder: 'e.g. I founded and run an agro-processing company with $8m annual revenue. Also rental income from 6 properties in London.' },
          { key: 'firstDepositSource', label: 'Where will the first deposit come from?', kind: 'textarea', rows: 3, hint: "The specific source of the money you'll move in first.", placeholder: 'e.g. Dividends paid from my company in 2025, currently in my personal domiciliary account.' },
          { key: 'expectedUsage', label: 'How do you expect to use the account?', kind: 'textarea', rows: 3, hint: 'Typical money in and out, how often, and which countries.', placeholder: 'e.g. One large deposit, then 3–4 outgoing payments a month to the UK for school fees and property costs.' },
        ],
      },
      {
        title: 'Your background',
        fields: [
          { key: 'pep', label: 'Are you, or is a close family member, a politically exposed person?', kind: 'select', options: ['No', 'Yes', 'Not sure'], full: true },
          { key: 'existingAccounts', label: 'Do you have any existing private banking or offshore accounts?', kind: 'textarea', rows: 3, hint: 'Where, and whether any bank has declined or closed an account for you before.', placeholder: 'e.g. I had an account in Switzerland that closed in 2022 when I dropped below their minimum.' },
          { key: 'companyDetails', label: 'For corporate accounts: tell us about the company', kind: 'textarea', rows: 3, hint: 'Name, country of registration, what it does, who owns it and annual turnover. For a personal account, write "Personal".', placeholder: 'e.g. ABC Logistics Ltd, registered in England, freight forwarding, I own 70%, turnover about $5m.' },
        ],
      },
    ],
  },
  {
    slug: 'high-value-real-estate',
    name: 'High Value Real Estate Purchase',
    shortName: 'Real Estate Purchase',
    cardText: 'Buy prime property abroad with funds ready on time.',
    title: 'Buy property abroad, with funds ready on time',
    intro: 'We line up the money, the paperwork and the right professionals for your purchase.',
    amountLabel: 'Purchase budget',
    timelineLabel: 'When do you need to complete?',
    timelineOptions: TIMELINE_OPTIONS,
    extra: { key: 'whereBuying', label: 'Where are you buying?', kind: 'text', placeholder: 'e.g. London, United Kingdom' },
    sections: [
      ABOUT_YOU,
      {
        title: 'The property',
        fields: [
          { key: 'propertyDescription', label: "Describe the property you're looking for", kind: 'textarea', rows: 4, hint: 'Type, size, area, new build or resale, home or investment.', placeholder: "e.g. A 4-bed family home in Hampstead or St John's Wood, for our family to live in while the children attend school in London." },
          { key: 'buyingStage', label: 'Where are you in the buying process?', kind: 'textarea', rows: 3, hint: 'Still searching, found a property, offer made or accepted, or ready to complete? Share an address or link if you have one.', placeholder: "e.g. We've had an offer accepted on a property in Chelsea. The seller wants to exchange within 6 weeks." },
        ],
      },
      {
        title: 'Funding and ownership',
        fields: [
          { key: 'funding', label: 'How will you fund the purchase?', kind: 'textarea', rows: 3, hint: 'Cash, mortgage or a mix. Where are the funds held now, and in which currency?', placeholder: 'e.g. 60% cash held in pounds with a UK bank, 40% mortgage if we can get one.' },
          { key: 'sourceOfFunds', label: 'Where does the money come from?', kind: 'textarea', rows: 4, hint: 'Business income, salary, sale of a property or business, investments or inheritance.', placeholder: 'e.g. Profits from my logistics company in Birmingham over the last 8 years, plus the sale of a property in Abuja in 2025.' },
          { key: 'ownership', label: 'Who will own the property?', kind: 'textarea', rows: 3, hint: "In your own name, jointly, through a company or a trust. Tell us if you're not sure.", placeholder: "e.g. Not sure yet. We'd like advice on whether to buy through a company." },
        ],
      },
      {
        title: 'How we can help',
        fields: [
          { key: 'needFromUs', label: 'What do you need from us?', kind: 'textarea', rows: 3, hint: 'Moving funds, a mortgage, a lawyer, an agent to find property, or setting up a company or trust to buy through.', placeholder: 'e.g. Moving funds in stages, introductions to a conveyancing lawyer and a mortgage broker for overseas buyers.' },
          { key: 'complications', label: 'Anything that could delay or complicate the purchase?', kind: 'textarea', rows: 3, hint: "Deadlines, documents you're waiting on, or a bank that turned you down.", placeholder: 'e.g. My last transfer of this size was held by my bank for 3 weeks.' },
        ],
      },
    ],
  },
  {
    slug: 'trust-offshore-company',
    name: 'Trust & Offshore Company',
    shortName: 'Trust & Offshore',
    cardText: 'Protect and pass on assets through the right structure.',
    title: 'Plan your trust or offshore company',
    intro: "Tell us what you want to protect and who it's for. We'll suggest the right structure and jurisdiction.",
    amountLabel: 'Approximate value of assets',
    timelineLabel: 'When do you want it set up?',
    timelineOptions: TIMELINE_OPTIONS,
    extra: { key: 'structureType', label: 'What are you looking to set up?', kind: 'select', options: ['A trust', 'An offshore company', 'A foundation', 'A trust that owns a company', 'Not sure, please advise'] },
    sections: [
      ABOUT_YOU,
      {
        title: 'Your goals',
        fields: [
          { key: 'preferredJurisdiction', label: 'Preferred jurisdiction', kind: 'select', options: ['Not sure, please advise', 'British Virgin Islands', 'Cayman Islands', 'Jersey', 'Guernsey', 'Isle of Man', 'Mauritius', 'UAE', 'Singapore', 'Other'] },
          { key: 'needsBankAccount', label: 'Will the structure need its own bank account?', kind: 'select', options: ['Yes', 'No', 'Not sure'] },
          { key: 'structureGoals', label: 'What do you want the structure to achieve?', kind: 'textarea', rows: 4, hint: 'Protecting assets, passing wealth to your children, holding property or investments, international trade, or privacy.', placeholder: 'e.g. I want my property and investments held so my children can inherit without delays, and protected if anything happens to my business.' },
          { key: 'jurisdictionReason', label: 'Why that jurisdiction, if you have one in mind?', kind: 'textarea', rows: 3, hint: 'If you would like us to advise, write "Please advise".', placeholder: "e.g. My lawyer suggested Jersey, but I'd like to compare it with Mauritius." },
        ],
      },
      {
        title: 'Assets and people',
        fields: [
          { key: 'assets', label: 'What assets will the structure hold, and where are they now?', kind: 'textarea', rows: 4, hint: 'Cash, property, company shares, investments, with the country each is in.', placeholder: 'e.g. About $3m cash across banks in the UK and the UAE, a flat in London, and 40% of a private company in London.' },
          { key: 'assetsOrigin', label: 'How were these assets built up?', kind: 'textarea', rows: 4, hint: 'Your source of wealth. Providers must check this before they can take you on.', placeholder: 'e.g. 15 years running a construction company, plus property investments since 2012.' },
          { key: 'beneficiaries', label: 'Who should benefit, and who should be in control?', kind: 'textarea', rows: 3, hint: 'Beneficiaries, and who makes decisions: you, a family member or a professional trustee.', placeholder: "e.g. My wife and 3 children should benefit. I want to keep control while I'm alive." },
        ],
      },
      {
        title: 'Your current position',
        fields: [
          { key: 'existingStructures', label: 'Do you already have any trusts, offshore companies or offshore accounts?', kind: 'textarea', rows: 3, hint: 'What and where, even if inactive.', placeholder: "e.g. A BVI company set up in 2019 that hasn't been used since." },
          { key: 'priorAdvice', label: 'Have you had tax or legal advice in your home country about this?', kind: 'textarea', rows: 3, hint: 'We work alongside your advisers, or can introduce licensed ones.', placeholder: "e.g. Not yet. I'd like an introduction to a tax adviser." },
        ],
      },
    ],
  },
  {
    slug: 'bespoke-services',
    name: 'Bespoke Services',
    shortName: 'Bespoke / Not sure',
    cardText: 'Business sale, relocation, or something else. Not sure? Start here.',
    title: 'Tell us what you need',
    intro: "Business sales, relocations, consolidating accounts, family support abroad. Describe it and we'll find the right route.",
    amountLabel: 'Approximate value involved',
    timelineLabel: 'When do you need this done?',
    timelineOptions: TIMELINE_OPTIONS,
    extra: { key: 'category', label: 'Which best describes it?', kind: 'select', options: ['Proceeds from a business sale', 'Relocating to another country', 'Consolidating accounts or portfolios', 'Wealth management introduction', 'School fees or family support abroad', 'Setting up a family office', 'Something else / not sure'] },
    sections: [
      ABOUT_YOU,
      {
        title: 'Your requirement',
        fields: [
          { key: 'needDescription', label: 'Describe what you need help with', kind: 'textarea', rows: 5, hint: "What's happening, what you want to do, and why now.", placeholder: "e.g. I'm selling my stake in a UK business in Q1 and want the proceeds held in a UK or Swiss private bank, then invested." },
          { key: 'countries', label: 'Which countries are involved?', kind: 'textarea', rows: 2, hint: 'Where the money or assets are now, and where they need to go.', placeholder: 'e.g. From the UK to Switzerland, possibly Singapore.' },
        ],
      },
      {
        title: 'Background',
        fields: [
          { key: 'sourceOfWealth', label: 'Where does the money or wealth come from?', kind: 'textarea', rows: 3, hint: 'Business income, the sale of a business or property, investments or inheritance.', placeholder: 'e.g. Sale of 30% of my fintech company to a private equity buyer.' },
          { key: 'triedSoFar', label: 'What have you tried so far, and what got in the way?', kind: 'textarea', rows: 3, hint: "Banks that declined you, delays, advisers you've spoken to.", placeholder: "e.g. My UK bank asked for documents I couldn't easily provide and capped the transfer." },
          { key: 'otherAdvisers', label: 'Are other advisers involved?', kind: 'textarea', rows: 2, hint: "Lawyers, accountants, wealth managers. We're happy to work alongside them.", placeholder: 'e.g. My accountant in London handles the company side.' },
          { key: 'goodOutcome', label: 'What would a good outcome look like for you?', kind: 'textarea', rows: 3, hint: 'What should be true once this is done?', placeholder: 'e.g. Funds safely in a regulated private bank, earning interest, with a relationship manager I can call.' },
        ],
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

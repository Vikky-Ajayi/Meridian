export type StatusCapability = 'Under Review' | 'Verified' | 'Available for Matching' | 'Archived';
export type StatusRequirement = 'Under Review' | 'Verification' | 'Searching for Match' | 'Introduction Available' | 'Completed' | 'Closed';

export interface Capability {
  id: string;
  category: string;
  title: string;
  status: StatusCapability;
  dateSubmitted: string;
  reference: string;
  geography: string;
  dealSize: string;
  description: string;
  priorExperience?: string;
}

export interface Requirement {
  id: string;
  category: string;
  title: string;
  status: StatusRequirement;
  dateSubmitted: string;
  reference: string;
  geography: string;
  dealSize: string;
  description: string;
  timeline: string;
}

export const MOCK_CAPABILITIES: Capability[] = [
  {
    id: 'cap-1',
    category: 'TRADE / COMMODITIES',
    title: 'West Africa, UK, EU',
    status: 'Verified',
    dateSubmitted: '28 Jul 2026',
    reference: 'REQ-1042',
    geography: 'West Africa, UK, EU',
    dealSize: '£1M – £5M',
    description: 'Established relationship with an agricultural trading group operating in West Africa, able to facilitate introductions between verified buyers and suppliers',
    priorExperience: 'Facilitated two prior introductions in the agribusiness sector over the last three years.',
  },
  {
    id: 'cap-2',
    category: 'BUSINESS M&A',
    title: 'UK, Ireland',
    status: 'Available for Matching',
    dateSubmitted: '28 Jul 2026',
    reference: 'REQ-1042',
    geography: 'UK, Ireland',
    dealSize: '£1M – £5M',
    description: 'Strong relationships across mid-market M&A advisors in the UK and Ireland, able to facilitate introductions for business acquisitions and mergers.',
  },
];

export const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: 'req-1',
    category: 'SUPPLY CONTRACTS',
    title: 'Looking for UK/EU buyers',
    status: 'Under Review',
    dateSubmitted: '28 Jul 2026',
    reference: 'REQ-1042',
    geography: 'Looking for UK/EU buyers',
    dealSize: '£1M – £5M',
    description: 'Seeking introductions to established distributors in the UK or EU market for a long-term supply arrangement in processed cashew nuts.',
    timeline: 'Within 3 months',
  },
  {
    id: 'req-2',
    category: 'SUPPLY CONTRACTS',
    title: 'West Africa sourcing, EU sale',
    status: 'Searching for Match',
    dateSubmitted: '28 Jul 2026',
    reference: 'REQ-1042',
    geography: 'West Africa / EU',
    dealSize: '£1M – £5M',
    description: 'Looking for suppliers in West Africa for agricultural produce to be sold into EU markets.',
    timeline: 'Immediately',
  },
  {
    id: 'req-3',
    category: 'REAL ESTATE & DEVELOPMENT',
    title: 'South East England',
    status: 'Closed',
    dateSubmitted: '28 Jul 2026',
    reference: 'REQ-1042',
    geography: 'South East England',
    dealSize: '£1M – £5M',
    description: 'Seeking introductions to landowners and developers in the South East England region for residential development projects.',
    timeline: '3–6 months',
  },
];

export const MOCK_USER = {
  name: 'Freeborn Ehirhere',
  email: 'Freebornehirhere@gmail.com',
};

export const DEAL_CATEGORIES = [
  'Trade / Commodities',
  'Business M&A',
  'Real Estate & Development',
  'Supply Contracts',
  'Private Equity',
  'Advisory',
  'Other',
];

export const GEOGRAPHIES = [
  'UK',
  'Europe',
  'West Africa',
  'Middle East',
  'North America',
  'Asia',
  'Caribbean',
  'Other',
];

export const TIMELINES = [
  'Immediately',
  'Within 30 days',
  'Within 3 months',
  '3–6 months',
  '6–12 months',
  'Exploring options',
];

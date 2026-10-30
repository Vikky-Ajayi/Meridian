import { useState } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { PhoneDialCodeSelect } from '@/components/PhoneDialCodeSelect';
import {
  useLogBelowMinimumEnquiry,
  useSubmitMoveMoneyEnquiry,
  useSubmitPrivateBankingEnquiry,
} from '@workspace/api-client-react';
import { COUNTRIES } from '@/lib/countries';

type FlowType = 'move' | 'bank';

const BELOW_MINIMUM_OPTION = 'Less than £50,000';

type Answers = Record<string, string | string[]>;

interface ChoiceQuestion {
  key: string;
  label?: string;
  options: readonly string[];
}

type Step =
  | { kind: 'single'; question: string; hint?: string; key: string; options: readonly string[] }
  | { kind: 'multi'; question: string; hint?: string; key: string; options: readonly string[] }
  | { kind: 'country'; question: string; hint?: string; key: string }
  | {
      kind: 'text';
      question: string;
      hint?: string;
      key: string;
      placeholder: string;
      minChars: number;
      // Optional single-choice question asked on the same step, below the text box.
      extra?: { question: string; hint?: string; key: string; options: readonly string[] };
    }
  | { kind: 'combined'; question: string; hint?: string; questions: readonly ChoiceQuestion[] };

const moveSteps: readonly Step[] = [
  {
    kind: 'single',
    key: 'amount',
    question: 'What Is The Approximate Amount You Are Looking To Move?',
    options: [BELOW_MINIMUM_OPTION, '£50,000 – £500,000', '£500,000 – £1 million', '£1 million – £10 million', '£10 million+', 'Prefer not to disclose'],
  },
  {
    kind: 'country',
    key: 'origin',
    question: 'Where Are The Funds Currently Located?',
    hint: 'Select the country where the funds are currently held.',
  },
  {
    kind: 'country',
    key: 'destination',
    question: 'Where Do You Intend To Move The Funds?',
    hint: 'Select the intended destination country.',
  },
  {
    kind: 'text',
    key: 'purpose',
    question: 'What Is The Purpose Of Your Proposed International Transfer?',
    hint: 'Please explain why you intend to move the funds internationally, what they will be used for at the destination, and the nature of the transaction.',
    placeholder: 'Describe the purpose of your transfer in detail…',
    minChars: 80,
  },
  {
    kind: 'text',
    key: 'source',
    question: 'What Is The Source Of The Funds You Intend To Transfer?',
    hint: 'Please explain generally how the funds were obtained, for example business revenue, investments, a property sale, inheritance or employment income. Do not include account numbers or upload documents.',
    placeholder: 'Explain how the funds were obtained…',
    minChars: 60,
  },
  {
    kind: 'combined',
    question: 'Are The Funds Currently Available And Where Are They Held?',
    hint: 'These details help us understand whether the proposed transfer is ready to progress.',
    questions: [
      {
        key: 'institution',
        label: 'Are the funds currently held in a bank or another regulated financial institution?',
        options: ['Yes', 'No', 'Currently being arranged'],
      },
      {
        key: 'availability',
        label: 'Are the funds currently available for transfer?',
        options: ['Yes, fully available', 'Partially available', 'Not yet available'],
      },
      {
        key: 'authority',
        label: 'What is your authority to arrange this transfer?',
        options: [
          'I own or control the funds',
          'I am an authorised business representative',
          'I am a professional adviser acting for a client',
          'Other',
        ],
      },
    ],
  },
  {
    kind: 'single',
    key: 'timeline',
    question: 'When Are You Looking To Proceed?',
    options: ['Immediately', 'Within 30 days', '1–3 months', 'More than 3 months', 'Researching options'],
  },
  {
    kind: 'text',
    key: 'assistance',
    question: 'What Assistance Do You Require With Your International Transfer?',
    hint: 'Please describe your current transfer arrangements, whether you have already approached a bank or financial institution, any difficulties encountered, and what specific assistance you require from Envoi & Co.',
    placeholder: 'Explain your current arrangements and the assistance you need…',
    minChars: 80,
  },
];

const bankSteps: readonly Step[] = [
  {
    kind: 'single',
    key: 'banking',
    question: 'What Type Of Banking Relationship Are You Seeking?',
    hint: 'Select the option that best describes your requirements.',
    options: ['Personal private banking', 'Business banking', 'Family office services', 'Investment banking relationship', 'Other'],
  },
  {
    kind: 'single',
    key: 'wealth',
    question: 'What Is Your Approximate Investable Wealth?',
    hint: 'Select the approximate value of financial assets available for banking or investment, excluding assets that cannot readily be accessed or transferred.',
    options: ['Below £250,000', '£250,000 – £1 million', '£1 million – £5 million', '£5 million – £25 million', '£25 million+', 'Prefer not to disclose'],
  },
  {
    kind: 'multi',
    key: 'jurisdictions',
    question: 'Which Jurisdictions Are You Interested In?',
    hint: 'Select all locations where you would consider establishing a banking relationship.',
    options: ['UK', 'Switzerland', 'UAE', 'Other European countries', 'Caribbean', 'Other'],
  },
  {
    kind: 'text',
    key: 'purpose',
    question: 'What Are You Looking To Achieve Through A Private Banking Relationship?',
    hint: 'Please describe your specific banking needs, the services or facilities you require, and what you hope to achieve through an introduction.',
    placeholder: 'Please explain your banking requirements in detail...',
    minChars: 100,
  },
  {
    kind: 'text',
    key: 'source',
    question: 'What Is The General Source Of Your Wealth Or Funds?',
    hint: 'Please briefly explain how your wealth or funds were accumulated, such as through business ownership, employment, investments, inheritance, or asset sales. Do not provide confidential documents at this stage.',
    placeholder: 'Please provide a general explanation of the origin of your wealth or funds...',
    minChars: 100,
    extra: {
      key: 'capital',
      question: 'Approximately How Much Capital Would You Initially Intend To Place With A Banking Institution?',
      hint: 'Please indicate the approximate amount of funds you expect to make available when establishing the relationship.',
      options: ['Below £250,000', '£250,000 – £1 million', '£1 million – £5 million', '£5 million – £25 million', '£25 million+', 'Amount not yet determined'],
    },
  },
  {
    kind: 'single',
    key: 'timeline',
    question: 'How Soon Are You Looking To Establish A Banking Relationship?',
    hint: 'Please select your anticipated timeframe.',
    options: ['Immediately', 'Within 3 months', 'Within 3–12 months', 'Currently exploring options'],
  },
  {
    kind: 'text',
    key: 'motivation',
    question: 'What Has Prompted You To Seek A New Banking Relationship At This Time?',
    hint: 'Please explain why you are considering establishing a new banking relationship, whether you currently bank with another institution, and what has motivated you to explore alternative banking arrangements.',
    placeholder: 'Tell us what prompted your enquiry and why you are considering a new banking relationship...',
    minChars: 100,
  },
];

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flow-progress">
      {Array.from({ length: total }).map((_, index) => (
        <span className={index <= step ? 'done' : ''} key={index} />
      ))}
    </div>
  );
}

function BelowMinimumNotice({ onBack }: { onBack: () => void }) {
  return (
    <div className="flow-card below-minimum">
      <h2>Thank You For Your Interest</h2>
      <p>
        Our service is designed for individuals and businesses looking to move significant
        amounts of capital. Unfortunately, the amount you've selected falls below our current
        minimum threshold.
      </p>
      <p>If you need to move larger funds in the future, we'd be delighted to assist you.</p>
      <p>
        You can also recommend our service to friends, family or business associates who may
        benefit from our expertise.
      </p>
      <p>We look forward to assisting you in the future.</p>
      <div className="flow-actions">
        <button className="back" type="button" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}

function CountryOptions({
  options,
  selected,
  onSelect,
}: {
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
}) {
  const [query, setQuery] = useState('');
  const matches = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <input
        className="country-search"
        type="search"
        placeholder="Search countries"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search countries"
      />
      <div className="option-list country-list">
        {matches.map((option) => (
          <button
            className={`flow-option ${selected === option ? 'selected' : ''}`}
            type="button"
            key={option}
            onClick={() => onSelect(option)}
          >
            <span className="radio" />
            {option}
          </button>
        ))}
        {matches.length === 0 && <p className="country-empty">No matching country</p>}
      </div>
    </>
  );
}

function ChoiceList({
  options,
  isSelected,
  onToggle,
  multi = false,
  compact = false,
}: {
  options: readonly string[];
  isSelected: (option: string) => boolean;
  onToggle: (option: string) => void;
  multi?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`option-list${compact ? ' compact' : ''}`}>
      {options.map((option) => (
        <button
          className={`flow-option ${isSelected(option) ? 'selected' : ''}`}
          type="button"
          key={option}
          onClick={() => onToggle(option)}
        >
          <span className={multi ? 'check' : 'radio'} />
          {option}
        </button>
      ))}
    </div>
  );
}

interface ContactState {
  fullName: string;
  countryOfResidence: string;
  dialCode: string;
  whatsappNumber: string;
  emailAddress: string;
}

function ContactStep({
  type,
  step,
  total,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: {
  type: FlowType;
  step: number;
  total: number;
  onBack: () => void;
  onSubmit: (contact: ContactState) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [contact, setContact] = useState<ContactState>({
    fullName: '',
    countryOfResidence: '',
    dialCode: '+44',
    whatsappNumber: '',
    emailAddress: '',
  });

  const set = (field: keyof ContactState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setContact((prev) => ({ ...prev, [field]: e.target.value }));

  const isValid =
    contact.fullName.trim() &&
    contact.countryOfResidence.trim() &&
    contact.whatsappNumber.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.emailAddress.trim());

  return (
    <div className="flow-card contact-step">
      <div className="step-label">Step {step + 1} of {total}</div>
      <Progress step={step} total={total} />
      <h2>
        {type === 'bank'
          ? 'A Few Details So Our Private Client Desk Can Reach You'
          : 'A Few Details So The Desk Can Reach You.'}
      </h2>
      <p className="flow-hint">
        {type === 'bank'
          ? 'Provide your contact information so our team can review your enquiry and contact you where appropriate.'
          : 'Our team will review your enquiry and contact you where appropriate.'}
      </p>
      <div className="flow-fields">
        <label>
          Full name
          <input
            placeholder="Your full name"
            value={contact.fullName}
            onChange={set('fullName')}
          />
        </label>
        <label>
          Country of residence
          <input
            placeholder="e.g. United Kingdom"
            value={contact.countryOfResidence}
            onChange={set('countryOfResidence')}
          />
        </label>
        <label>
          Best WhatsApp number
          <div className="phone-input">
            <PhoneDialCodeSelect
              value={contact.dialCode}
              onChange={(dial) => setContact((prev) => ({ ...prev, dialCode: dial }))}
            />
            <input
              placeholder="7700 000000"
              value={contact.whatsappNumber}
              onChange={set('whatsappNumber')}
            />
          </div>
        </label>
        <label>
          Email address
          <input
            type="email"
            placeholder="your@email.com"
            value={contact.emailAddress}
            onChange={set('emailAddress')}
          />
        </label>
      </div>
      <p className="flow-fineprint">
        {type === 'bank'
          ? 'Your information will be used to review and respond to your enquiry in accordance with the applicable Privacy Notice.'
          : 'Do not submit bank account details or confidential documents. Your information is for preliminary enquiry review only.'}
      </p>
      {error && (
        <p style={{ color: '#c00', fontSize: 14, marginTop: 12 }}>{error}</p>
      )}
      <div className="flow-actions">
        <button className="back" type="button" onClick={onBack} disabled={isSubmitting}>
          ← Back
        </button>
        <button
          className="continue"
          type="button"
          disabled={!isValid || isSubmitting}
          style={{ opacity: !isValid || isSubmitting ? 0.5 : 1 }}
          onClick={() => onSubmit(contact)}
        >
          {isSubmitting
            ? 'Submitting…'
            : type === 'bank'
            ? 'Submit Enquiry'
            : 'Continue'}
        </button>
      </div>
    </div>
  );
}

const asText = (v: string | string[] | undefined) => (typeof v === 'string' ? v : '');
const asList = (v: string | string[] | undefined) => (Array.isArray(v) ? v : []);

/** Free-text answers must be substantive, so reject one-word or repeated filler. */
function isMeaningful(text: string, minChars: number) {
  const trimmed = text.trim();
  return trimmed.length >= minChars && new Set(trimmed.toLowerCase().split(/\s+/)).size >= 5;
}

function stepIsComplete(step: Step, answers: Answers): boolean {
  switch (step.kind) {
    case 'single':
    case 'country':
      return asText(answers[step.key]) !== '';
    case 'multi':
      return asList(answers[step.key]).length > 0;
    case 'text':
      return (
        isMeaningful(asText(answers[step.key]), step.minChars) &&
        (!step.extra || asText(answers[step.extra.key]) !== '')
      );
    case 'combined':
      return step.questions.every((q) => asText(answers[q.key]) !== '');
  }
}

function incompleteMessage(step: Step): string {
  if (step.kind === 'text') {
    return `Please provide a meaningful response of at least ${step.minChars} characters${
      step.extra ? ' and choose an option below' : ''
    }.`;
  }
  if (step.kind === 'multi') return 'Please select at least one option.';
  if (step.kind === 'combined') return 'Please answer every question on this page.';
  return 'Please select an option to continue.';
}

export function FlowPage({ type }: { type: FlowType }) {
  const isBank = type === 'bank';
  const steps = isBank ? bankSteps : moveSteps;
  const totalSteps = steps.length + 1; // +1 for contact step
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [belowMinimum, setBelowMinimum] = useState(false);

  const [, setLocation] = useLocation();
  const moveMoneyMutation = useSubmitMoveMoneyEnquiry();
  const privateBankingMutation = useSubmitPrivateBankingEnquiry();
  const logBelowMinimum = useLogBelowMinimumEnquiry();
  const mutation = isBank ? privateBankingMutation : moveMoneyMutation;
  const isSubmitting = mutation.isPending;

  const isContactStep = step === totalSteps - 1;
  const current = isContactStep ? null : steps[step];
  const pageTitle = isBank ? 'Private Banking Introduction' : 'Move Money Abroad';

  const setAnswer = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStepError(null);
  };

  const toggleMulti = (key: string, option: string) => {
    const list = asList(answers[key]);
    setAnswer(key, list.includes(option) ? list.filter((o) => o !== option) : [...list, option]);
  };

  function goTo(next: number) {
    setStepError(null);
    setStep(next);
    window.scrollTo(0, 0);
  }

  function handleContinue() {
    if (!current) return;
    if (!stepIsComplete(current, answers)) {
      setStepError(incompleteMessage(current));
      return;
    }
    if (!isBank && step === 0 && answers.amount === BELOW_MINIMUM_OPTION) {
      // Amount only, no contact details; a logging failure must not block the message.
      logBelowMinimum.mutate({ data: { amountRange: BELOW_MINIMUM_OPTION } });
      setBelowMinimum(true);
      return;
    }
    goTo(step + 1);
  }

  async function handleSubmit(contact: ContactState) {
    setSubmitError(null);
    // Combine country dial code + number into one field
    const fullWhatsapp = `${contact.dialCode} ${contact.whatsappNumber}`.trim();
    const contactFields = {
      fullName: contact.fullName.trim(),
      countryOfResidence: contact.countryOfResidence.trim(),
      whatsappNumber: fullWhatsapp,
      emailAddress: contact.emailAddress.trim(),
    };
    try {
      if (isBank) {
        const result = await privateBankingMutation.mutateAsync({
          data: {
            bankingRelationshipType: asText(answers.banking),
            investableWealth: asText(answers.wealth),
            jurisdictions: asList(answers.jurisdictions),
            purpose: asText(answers.purpose),
            sourceOfWealth: asText(answers.source),
            initialCapital: asText(answers.capital),
            timeline: asText(answers.timeline),
            motivation: asText(answers.motivation),
            ...contactFields,
          },
        });
        sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
        setLocation('/private-banking-success');
      } else {
        const result = await moveMoneyMutation.mutateAsync({
          data: {
            amountRange: asText(answers.amount),
            fundsLocation: asText(answers.origin),
            destination: asText(answers.destination),
            purpose: asText(answers.purpose),
            sourceOfFunds: asText(answers.source),
            regulatedInstitution: asText(answers.institution),
            fundsAvailability: asText(answers.availability),
            transferAuthority: asText(answers.authority),
            timeline: asText(answers.timeline),
            assistanceRequired: asText(answers.assistance),
            ...contactFields,
          },
        });
        sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
        setLocation('/move-money-success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      // Surface a cleaner message for network/404 errors
      setSubmitError(
        msg.includes('404') || msg.includes('NOT_FOUND')
          ? 'Unable to reach the server. Please try again shortly.'
          : msg
      );
    }
  }

  function renderStepBody(s: Step) {
    switch (s.kind) {
      case 'single':
        return (
          <ChoiceList
            options={s.options}
            isSelected={(o) => answers[s.key] === o}
            onToggle={(o) => setAnswer(s.key, o)}
          />
        );
      case 'multi':
        return (
          <>
            <p className="select-note">Select All That Apply</p>
            <ChoiceList
              multi
              options={s.options}
              isSelected={(o) => asList(answers[s.key]).includes(o)}
              onToggle={(o) => toggleMulti(s.key, o)}
            />
          </>
        );
      case 'country':
        return (
          <CountryOptions
            key={s.key}
            options={COUNTRIES}
            selected={asText(answers[s.key])}
            onSelect={(o) => setAnswer(s.key, o)}
          />
        );
      case 'text': {
        const value = asText(answers[s.key]);
        return (
          <>
            <textarea
              className="flow-textarea"
              value={value}
              maxLength={2500}
              placeholder={s.placeholder}
              onChange={(e) => setAnswer(s.key, e.target.value)}
            />
            <p className="flow-fineprint">
              Please provide a meaningful response (at least {s.minChars} characters).{' '}
              {value.trim().length} characters
            </p>
            {s.extra && (
              <div className="flow-extra">
                <h3>{s.extra.question}</h3>
                {s.extra.hint && <p className="flow-hint">{s.extra.hint}</p>}
                <ChoiceList
                  compact
                  options={s.extra.options}
                  isSelected={(o) => answers[s.extra!.key] === o}
                  onToggle={(o) => setAnswer(s.extra!.key, o)}
                />
              </div>
            )}
          </>
        );
      }
      case 'combined':
        return (
          <>
            {s.questions.map((q) => (
              <div className="flow-extra" key={q.key}>
                {q.label && <h3>{q.label}</h3>}
                <ChoiceList
                  compact
                  options={q.options}
                  isSelected={(o) => answers[q.key] === o}
                  onToggle={(o) => setAnswer(q.key, o)}
                />
              </div>
            ))}
          </>
        );
    }
  }

  return (
    <div className={`flow-page ${isBank ? 'is-bank' : 'is-move'}`}>
      <Navbar />
      <main className="flow-shell">
        <div className="flow-heading">
          <div>Private Client Desk</div>
          <h1>{pageTitle}</h1>
        </div>

        {belowMinimum ? (
          <BelowMinimumNotice onBack={() => setBelowMinimum(false)} />
        ) : isContactStep ? (
          <ContactStep
            type={type}
            step={step}
            total={totalSteps}
            onBack={() => goTo(step - 1)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        ) : (
          current && (
            <div className="flow-card">
              <div className="step-label">Step {step + 1} of {totalSteps}</div>
              <Progress step={step} total={totalSteps} />
              <h2>{current.question}</h2>
              {current.hint && <p className="flow-hint">{current.hint}</p>}
              {renderStepBody(current)}
              {stepError && <p className="flow-error" role="alert">{stepError}</p>}
              <div className="flow-actions">
                {step > 0 && (
                  <button className="back" type="button" onClick={() => goTo(step - 1)}>
                    ← Back
                  </button>
                )}
                <button className="continue" type="button" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

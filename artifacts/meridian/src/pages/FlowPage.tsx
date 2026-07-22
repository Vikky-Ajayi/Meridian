import { useState } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';

type FlowType = 'move' | 'bank';

const moveSteps = [
  ['What Is The Approximate Amount You Are Looking To Move?', ['£50,000 - £500,000', '£500,000 - £1million', '£1million - £10 million', '£10 million+', 'Prefer not to disclose']],
  ['Where Are The Funds Currently Located?', ['United Kingdom', 'Europe', 'Middle East', 'Africa', 'North America', 'Asia', 'Other']],
  ['Where Do You Intend To Move The Funds?', ['United Kingdom', 'Europe', 'Middle East', 'Africa', 'North America', 'Asia', 'Other']],
  ['What Is The Purpose Of The Transfer?', ['Asset diversification', 'Property purchase', 'Business transaction', 'Investment purposes', 'Wealth planning', 'Other']],
  ['When Are You Looking To Proceed?', ['Immediately', 'Within 30 days', '1-3 months', '3+ months', 'Researching options']],
  ['Are The Funds Currently Held With A Regulated Financial Institution?', ['Yes', 'No', 'Currently being arranged']],
] as const;

const bankSteps = [
  ['What Type Of Banking Relationship Are You Seeking?', ['Personal private banking', 'Business banking', 'Family office services', 'Investment banking relationship', 'Other']],
  ['What Is Your Approximate Investable Wealth?', ['£250,000 - £1million', '£1million - £5 million', '£5 million - £25 million', '£25 million+', 'Prefer not to disclose']],
  ['What Is Your Approximate Investable Wealth?', ['UK', 'Switzerland', 'UAE', 'Europe', 'Caribbean', 'Other'], 'Which Jurisdictions Are You Interested In?'],
  ['What Are Your Main Reasons For Seeking Private Banking?', ['Wealth management', 'International banking access', 'Asset protection planning', 'Business requirements', 'Credit/lending facilities', 'Other'], 'Which Jurisdictions Are You Interested In?'],
  ['How Soon Are You Looking To Establish A Relationship?', ['Immediately', 'Within 3 months', '3-12 months', 'Exploring options']],
] as const;

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flow-progress">
      {Array.from({ length: total }).map((_, index) => (
        <span className={index <= step ? 'done' : ''} key={index} />
      ))}
    </div>
  );
}

function ContactStep({ type, step, total, onBack }: { type: FlowType; step: number; total: number; onBack: () => void }) {
  const [, setLocation] = useLocation();
  const successPath = type === 'bank' ? '/private-banking-success' : '/move-money-success';

  return (
    <div className="flow-card contact-step">
      <div className="step-label">Step {step + 1} of {total}</div>
      <Progress step={step} total={total} />
      <h2>A Few Details So The Desk Can Reach You.</h2>
      <div className="flow-fields">
        <label>Full name<input placeholder="Placeholder text" /></label>
        <label>Country of residence<select><option>Placeholder text</option></select></label>
        <label>Best WhatsApp number<div className="phone-input"><span>●</span><input placeholder="000 0000 000 000" /></div></label>
        <label>Email address<input className="focused" placeholder="Placeholder text" /></label>
      </div>
      <div className="flow-actions">
        <button className="back" type="button" onClick={onBack}>← Back</button>
        <button className="continue" type="button" onClick={() => setLocation(successPath)}>
          {type === 'bank' ? 'Submit Enquiry' : 'Get My WhatsApp Line'}
        </button>
      </div>
    </div>
  );
}

export function FlowPage({ type }: { type: FlowType }) {
  const isBank = type === 'bank';
  const steps = isBank ? bankSteps : moveSteps;
  const total = isBank ? 6 : 7;
  const [step, setStep] = useState(0);
  const isContact = step === total - 1;
  const current = steps[Math.min(step, steps.length - 1)];
  const multi = isBank && (step === 2 || step === 3);
  const pageTitle = current?.[2] || (isBank ? 'Private Banking Introduction' : 'Move Money Abroad');

  return (
    <div className={`flow-page ${isBank ? 'is-bank' : 'is-move'}`}>
      <Navbar />
      <main className="flow-shell">
        <div className="flow-heading">
          <div>Private Client Desk</div>
          <h1>{pageTitle}</h1>
        </div>

        {isContact ? (
          <ContactStep type={type} step={step} total={total} onBack={() => setStep(step - 1)} />
        ) : (
          <div className="flow-card">
            <div className="step-label">Step {step + 1} of {total}</div>
            <Progress step={step} total={total} />
            <h2>{current[0]}</h2>
            {multi && <p className="select-note">Select All That Apply</p>}
            <div className="option-list">
              {current[1].map((option, index) => (
                <button className={`flow-option ${index < (multi ? 2 : 1) ? 'selected' : ''}`} type="button" key={option}>
                  <span className={multi ? 'check' : 'radio'} />
                  {option}
                </button>
              ))}
            </div>
            <div className="flow-actions">
              {step > 0 && <button className="back" type="button" onClick={() => setStep(step - 1)}>← Back</button>}
              <button className="continue" type="button" onClick={() => setStep(step + 1)}>Continue</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

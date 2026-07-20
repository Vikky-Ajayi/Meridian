import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitPrivateBankingEnquiry } from '@workspace/api-client-react';
import { COUNTRIES } from '@/lib/countries';

const formSchema = z.object({
  bankingRelationshipType: z.string().min(1, 'Required'),
  investableWealth: z.string().min(1, 'Required'),
  jurisdictions: z.array(z.string()).min(1, 'Select at least one'),
  reasons: z.array(z.string()).min(1, 'Select at least one'),
  timeline: z.string().min(1, 'Required'),
  fullName: z.string().min(2, 'Required'),
  countryOfResidence: z.string().min(1, 'Required'),
  whatsappNumber: z.string().min(5, 'Required'),
  emailAddress: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof formSchema>;

const TOTAL = 6;

function RadioOption({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg border text-left transition-all ${selected ? 'border-[#0F61E9] bg-[#EEF4FF]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-[#0F61E9] bg-[#0F61E9]' : 'border-gray-300 bg-white'}`}>
        {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
      </span>
      <span className="text-[15px] font-medium text-[#000B2D]">{label}</span>
    </button>
  );
}

function CheckOption({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg border text-left transition-all ${checked ? 'border-[#0F61E9] bg-[#EEF4FF]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <span className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'border-[#0F61E9] bg-[#0F61E9]' : 'border-gray-300 bg-white'}`}>
        {checked && (
          <svg viewBox="0 0 12 10" className="w-3 h-3 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,5 4,8 11,1" />
          </svg>
        )}
      </span>
      <span className="text-[15px] font-medium text-[#000B2D]">{label}</span>
    </button>
  );
}

export default function PrivateBankingIntroduction() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const submitEnquiry = useSubmitPrivateBankingEnquiry();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { bankingRelationshipType: '', investableWealth: '', jurisdictions: [], reasons: [], timeline: '', fullName: '', countryOfResidence: '', whatsappNumber: '', emailAddress: '' },
  });

  const getStepFields = (s: number): (keyof FormValues)[] => {
    const map: Record<number, (keyof FormValues)[]> = {
      0: ['bankingRelationshipType'],
      1: ['investableWealth'],
      2: ['jurisdictions'],
      3: ['reasons'],
      4: ['timeline'],
      5: ['fullName', 'countryOfResidence', 'whatsappNumber', 'emailAddress'],
    };
    return map[s] ?? [];
  };

  const goNext = async () => {
    const valid = await form.trigger(getStepFields(step));
    if (valid) { setStep(s => Math.min(s + 1, TOTAL - 1)); window.scrollTo(0, 0); }
  };

  const goBack = () => { setStep(s => Math.max(s - 1, 0)); window.scrollTo(0, 0); };

  const onSubmit = (data: FormValues) => {
    submitEnquiry.mutate({ data }, {
      onSuccess: result => {
        sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
        setLocation('/private-banking-success');
      },
    });
  };

  const stepQuestions = [
    'What Type Of Banking Relationship Are You Seeking?',
    'What Is Your Approximate Investable Wealth?',
    'Which Jurisdictions Are You Interested In?',
    'What Are Your Main Reasons For Seeking Private Banking?',
    'How Soon Are You Looking To Establish A Relationship?',
    'A Few Details So The Desk Can Reach You.',
  ];

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col">
      <Navbar />

      {/* Decorative rectangles */}
      <div className="fixed bottom-0 left-0 pointer-events-none select-none z-0">
        <div className="w-[140px] h-[320px] bg-[#1a1a1a] ml-4 mb-0" />
        <div className="w-[140px] h-[260px] bg-[#1a1a1a] absolute bottom-0 left-[170px]" />
        <div className="w-[140px] h-[200px] bg-[#1a1a1a] absolute bottom-0 left-[336px]" />
      </div>

      <main className="flex-1 flex flex-col items-center pt-28 pb-20 px-4 relative z-10">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase mb-3">Private Client Desk</p>
          <h1 className="text-[36px] font-semibold text-white leading-tight">Private Banking Introduction</h1>
        </div>

        <div className="w-full max-w-[620px] bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress */}
          <div className="px-8 pt-6 pb-0">
            <p className="text-xs text-gray-400 mb-2">Step {step + 1} of {TOTAL}</p>
            <div className="flex gap-[3px]">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} className={`h-[3px] flex-1 rounded-full transition-all ${i <= step ? 'bg-[#0F61E9]' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="px-8 py-7">
                <h2 className="text-[18px] font-bold text-[#000B2D] mb-6 leading-snug">{stepQuestions[step]}</h2>

                {/* Step 1 — radio */}
                {step === 0 && (
                  <FormField control={form.control} name="bankingRelationshipType" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} className="space-y-2">
                          {['Personal private banking', 'Business banking', 'Family office services', 'Investment banking relationship', 'Other'].map(opt => (
                            <RadioOption key={opt} label={opt} selected={field.value === opt} onSelect={() => field.onChange(opt)} />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="mt-2 text-red-500 text-sm" />
                    </FormItem>
                  )} />
                )}

                {/* Step 2 — radio */}
                {step === 1 && (
                  <FormField control={form.control} name="investableWealth" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} className="space-y-2">
                          {['£250,000 - £1 million', '£1 million - £5 million', '£5 million - £25 million', '£25 million+', 'Prefer not to disclose'].map(opt => (
                            <RadioOption key={opt} label={opt} selected={field.value === opt} onSelect={() => field.onChange(opt)} />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="mt-2 text-red-500 text-sm" />
                    </FormItem>
                  )} />
                )}

                {/* Step 3 — multi-select checkboxes */}
                {step === 2 && (
                  <Controller control={form.control} name="jurisdictions" render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      {['UK', 'Switzerland', 'UAE', 'Europe', 'Caribbean', 'Other'].map(opt => (
                        <CheckOption key={opt} label={opt} checked={field.value.includes(opt)} onToggle={() => {
                          const next = field.value.includes(opt) ? field.value.filter(v => v !== opt) : [...field.value, opt];
                          field.onChange(next);
                        }} />
                      ))}
                      {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                    </div>
                  )} />
                )}

                {/* Step 4 — multi-select checkboxes */}
                {step === 3 && (
                  <Controller control={form.control} name="reasons" render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      {['Wealth management', 'International banking access', 'Asset protection planning', 'Business requirements', 'Credit/lending facilities', 'Other'].map(opt => (
                        <CheckOption key={opt} label={opt} checked={field.value.includes(opt)} onToggle={() => {
                          const next = field.value.includes(opt) ? field.value.filter(v => v !== opt) : [...field.value, opt];
                          field.onChange(next);
                        }} />
                      ))}
                      {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                    </div>
                  )} />
                )}

                {/* Step 5 — radio */}
                {step === 4 && (
                  <FormField control={form.control} name="timeline" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} className="space-y-2">
                          {['Immediately', 'Within 3 months', '3–12 months', 'Exploring options'].map(opt => (
                            <RadioOption key={opt} label={opt} selected={field.value === opt} onSelect={() => field.onChange(opt)} />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="mt-2 text-red-500 text-sm" />
                    </FormItem>
                  )} />
                )}

                {/* Step 6 — contact */}
                {step === 5 && (
                  <div className="space-y-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#000B2D]">Full name</FormLabel>
                        <FormControl><Input {...field} placeholder="Placeholder text" className="h-11 border-gray-200 rounded-lg text-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="countryOfResidence" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#000B2D]">Country of residence</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-200 rounded-lg text-sm">
                              <SelectValue placeholder="Placeholder text" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#000B2D]">Best WhatsApp number</FormLabel>
                        <FormControl>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11">
                            <span className="px-3 border-r border-gray-200 text-lg select-none">🇳🇬</span>
                            <input {...field} placeholder="000 0000 000 000" className="flex-1 px-3 text-sm outline-none h-full" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="emailAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#000B2D]">Email address</FormLabel>
                        <FormControl><Input {...field} type="email" placeholder="Placeholder text" className="h-11 border-[#0F61E9] rounded-lg text-sm focus-visible:ring-[#0F61E9]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 pb-7">
                {step < 5 ? (
                  <>
                    <div className="flex justify-end">
                      <button type="button" onClick={goNext} className="bg-black text-white text-sm font-medium px-6 py-2.5 hover:bg-black/85 transition-colors">
                        Continue
                      </button>
                    </div>
                    {step > 0 && (
                      <div className="flex justify-center mt-3">
                        <button type="button" onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">← Back</button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button type="submit" disabled={submitEnquiry.isPending} className="w-full bg-black text-white text-sm font-semibold py-3.5 hover:bg-black/85 transition-colors disabled:opacity-60">
                      {submitEnquiry.isPending ? 'Submitting…' : 'Submit Enquiry'}
                    </button>
                    <div className="flex justify-center mt-3">
                      <button type="button" onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">← Back</button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}

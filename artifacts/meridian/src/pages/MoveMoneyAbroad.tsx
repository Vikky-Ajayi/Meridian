import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitMoveMoneyEnquiry } from '@workspace/api-client-react';
import { COUNTRIES } from '@/lib/countries';

const formSchema = z.object({
  amountRange: z.string().min(1, 'Required'),
  fundsLocation: z.string().min(1, 'Required'),
  destination: z.string().min(1, 'Required'),
  purpose: z.string().min(1, 'Required'),
  timeline: z.string().min(1, 'Required'),
  regulatedInstitution: z.string().min(1, 'Required'),
  fullName: z.string().min(2, 'Required'),
  countryOfResidence: z.string().min(1, 'Required'),
  whatsappNumber: z.string().min(5, 'Required'),
  emailAddress: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { field: 'amountRange' as const,         question: 'What Is The Approximate Amount You Are Looking To Move?',             options: ['£50,000 - £500,000', '£500,000 - £1 million', '£1 million - £10 million', '£10 million+', 'Prefer not to disclose'] },
  { field: 'fundsLocation' as const,        question: 'Where Are The Funds Currently Located?',                               options: ['United Kingdom', 'Europe', 'Middle East', 'Africa', 'North America', 'Asia', 'Other'] },
  { field: 'destination' as const,          question: 'Where Do You Intend To Move The Funds?',                               options: ['United Kingdom', 'Europe', 'Middle East', 'Africa', 'North America', 'Asia', 'Other'] },
  { field: 'purpose' as const,              question: 'What Is The Purpose Of The Transfer?',                                 options: ['Asset diversification', 'Property purchase', 'Business transaction', 'Investment purposes', 'Wealth planning', 'Other'] },
  { field: 'timeline' as const,             question: 'When Are You Looking To Proceed?',                                     options: ['Immediately', 'Within 30 days', '1–3 months', '3+ months', 'Researching options'] },
  { field: 'regulatedInstitution' as const, question: 'Are The Funds Currently Held With A Regulated Financial Institution?', options: ['Yes', 'No', 'Currently being arranged'] },
  { field: 'contact' as const,              question: 'A Few Details So The Desk Can Reach You.' },
];

const TOTAL = STEPS.length;

function RadioOption({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg border text-left transition-all ${
        selected ? 'border-[#0F61E9] bg-[#EEF4FF]' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? 'border-[#0F61E9] bg-[#0F61E9]' : 'border-gray-300 bg-white'
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
      </span>
      <span className="text-[15px] font-medium text-[#000B2D]">{label}</span>
    </button>
  );
}

export default function MoveMoneyAbroad() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const submitEnquiry = useSubmitMoveMoneyEnquiry();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { amountRange: '', fundsLocation: '', destination: '', purpose: '', timeline: '', regulatedInstitution: '', fullName: '', countryOfResidence: '', whatsappNumber: '', emailAddress: '' },
  });

  const goNext = async () => {
    if (step < 6) {
      const valid = await form.trigger(STEPS[step].field as any);
      if (valid) { setStep(s => s + 1); window.scrollTo(0, 0); }
    }
  };

  const goBack = () => { setStep(s => Math.max(s - 1, 0)); window.scrollTo(0, 0); };

  const onSubmit = (data: FormValues) => {
    submitEnquiry.mutate({ data }, {
      onSuccess: result => {
        sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
        setLocation('/move-money-success');
      },
    });
  };

  const progress = ((step + 1) / TOTAL) * 100;
  const current = STEPS[step];

  return (
    <div className="min-h-screen bg-[#0F61E9] font-sans flex flex-col">
      <Navbar />

      {/* Decorative rectangles */}
      <div className="fixed bottom-0 left-0 pointer-events-none select-none z-0">
        <div className="w-[140px] h-[320px] bg-[#0052CC] opacity-60 ml-4 mb-0" />
        <div className="w-[140px] h-[260px] bg-[#0052CC] opacity-40 absolute bottom-0 left-[170px]" />
        <div className="w-[140px] h-[200px] bg-[#0052CC] opacity-30 absolute bottom-0 left-[336px]" />
      </div>

      <main className="flex-1 flex flex-col items-center pt-28 pb-20 px-4 relative z-10">
        {/* Page header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/80 uppercase mb-3">Private Client Desk</p>
          <h1 className="text-[36px] font-semibold text-white leading-tight">Move Money Abroad</h1>
        </div>

        {/* Card */}
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
                <h2 className="text-[18px] font-bold text-[#000B2D] mb-6 leading-snug">{current.question}</h2>

                {step < 6 ? (
                  <FormField
                    control={form.control}
                    name={current.field as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup value={field.value} className="space-y-2">
                            {current.options!.map(opt => (
                              <RadioOption key={opt} label={opt} selected={field.value === opt} onSelect={() => field.onChange(opt)} />
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="mt-2 text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#000B2D]">Full name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Placeholder text" className="h-11 border-gray-200 rounded-lg text-sm" />
                        </FormControl>
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
                        <FormControl>
                          <Input {...field} type="email" placeholder="Placeholder text" className="h-11 border-[#0F61E9] rounded-lg text-sm focus-visible:ring-[#0F61E9]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="px-8 pb-7">
                {step < 6 ? (
                  <>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={goNext}
                        className="bg-black text-white text-sm font-medium px-6 py-2.5 hover:bg-black/85 transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                    {step > 0 && (
                      <div className="flex justify-center mt-3">
                        <button type="button" onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                          ← Back
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={submitEnquiry.isPending}
                      className="w-full bg-black text-white text-sm font-semibold py-3.5 hover:bg-black/85 transition-colors disabled:opacity-60"
                    >
                      {submitEnquiry.isPending ? 'Submitting…' : 'Get My WhatsApp Line'}
                    </button>
                    <div className="flex justify-center mt-3">
                      <button type="button" onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        ← Back
                      </button>
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

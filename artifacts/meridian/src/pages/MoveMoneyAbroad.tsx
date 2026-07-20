import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useSubmitMoveMoneyEnquiry } from '@workspace/api-client-react';

const formSchema = z.object({
  amountRange: z.string().min(1, "Required"),
  fundsLocation: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  purpose: z.string().min(1, "Required"),
  timeline: z.string().min(1, "Required"),
  regulatedInstitution: z.string().min(1, "Required"),
  fullName: z.string().min(2, "Required"),
  countryOfResidence: z.string().min(1, "Required"),
  whatsappNumber: z.string().min(5, "Required"),
  emailAddress: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { id: 'amountRange', title: "What Is The Approximate Amount You Are Looking To Move?", options: ["£50,000 - £500,000", "£500,000 - £1 million", "£1 million - £10 million", "£10 million+", "Prefer not to disclose"] },
  { id: 'fundsLocation', title: "Where Are The Funds Currently Located?", options: ["United Kingdom", "Europe", "Middle East", "Africa", "North America", "Asia", "Other"] },
  { id: 'destination', title: "Where Do You Intend To Move The Funds?", options: ["United Kingdom", "Europe", "Middle East", "Africa", "North America", "Asia", "Other"] },
  { id: 'purpose', title: "What Is The Purpose Of The Transfer?", options: ["Asset diversification", "Property purchase", "Business transaction", "Investment purposes", "Wealth planning", "Other"] },
  { id: 'timeline', title: "When Are You Looking To Proceed?", options: ["Immediately", "Within 30 days", "1-3 months", "3+ months", "Researching options"] },
  { id: 'regulatedInstitution', title: "Are The Funds Currently Held With A Regulated Financial Institution?", options: ["Yes", "No", "Currently being arranged"] },
  { id: 'contact', title: "A Few Details So The Desk Can Reach You." }
];

export default function MoveMoneyAbroad() {
  const [_, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const submitEnquiry = useSubmitMoveMoneyEnquiry();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { amountRange: "", fundsLocation: "", destination: "", purpose: "", timeline: "", regulatedInstitution: "", fullName: "", countryOfResidence: "", whatsappNumber: "", emailAddress: "" }
  });

  const nextStep = async () => {
    const fieldToValidate = STEPS[currentStep].id as keyof FormValues | 'contact';
    if (fieldToValidate === 'contact') return;
    const isValid = await form.trigger(fieldToValidate as any);
    if (isValid) {
      setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  };

  const onSubmit = (data: FormValues) => {
    submitEnquiry.mutate({ data }, {
      onSuccess: (result) => {
        sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
        setLocation('/move-money-success');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0F61E9] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-8 flex justify-between items-center max-w-5xl mx-auto w-full">
        <Logo theme="dark" />
        <Link href="/" className="text-white hover:text-white/80 text-sm font-medium">Return to Home</Link>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-24">
        <div className="text-center mb-8">
          <div className="text-xs font-bold tracking-[0.2em] text-white/70 mb-4 uppercase">Private Client Desk</div>
          <h1 className="text-4xl font-bold">Move Money Abroad</h1>
        </div>

        <div className="w-full max-w-2xl bg-white text-[#000B2D] rounded-2xl p-8 sm:p-12 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep < 6 ? (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">{STEPS[currentStep].title}</h2>
                  <FormField control={form.control} name={STEPS[currentStep].id as any} render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          {STEPS[currentStep].options?.map(opt => (
                            <label key={opt} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${field.value === opt ? 'border-[#0F61E9] bg-[#0F61E9]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                              <RadioGroupItem value={opt} className="sr-only" />
                              <div className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${field.value === opt ? 'border-[#0F61E9] bg-[#0F61E9]' : 'border-gray-300'}`}>
                                {field.value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className="font-medium">{opt}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              ) : (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">{STEPS[currentStep].title}</h2>
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full name</FormLabel><FormControl><Input {...field} className="h-12 border-gray-200" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="countryOfResidence" render={({ field }) => (
                    <FormItem><FormLabel>Country of residence</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-12 border-gray-200"><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["United Kingdom", "United States", "UAE", "Switzerland", "Singapore", "Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                    <FormItem><FormLabel>Best WhatsApp number</FormLabel><FormControl><Input {...field} placeholder="+44 7000 000000" className="h-12 border-gray-200" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="emailAddress" render={({ field }) => (
                    <FormItem><FormLabel>Email address</FormLabel><FormControl><Input {...field} type="email" className="h-12 border-gray-200" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              )}

              <div className="flex justify-between pt-6 mt-8 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0 || submitEnquiry.isPending} className="text-gray-500 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                {currentStep < 6 ? (
                  <Button type="button" onClick={nextStep} className="bg-[#000B2D] hover:bg-[#000B2D]/90 text-white rounded-full px-8">
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={submitEnquiry.isPending} className="bg-[#000B2D] hover:bg-[#000B2D]/90 text-white rounded-full px-8">
                    {submitEnquiry.isPending ? 'Submitting...' : 'Get My WhatsApp Line'} 
                    {!submitEnquiry.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}

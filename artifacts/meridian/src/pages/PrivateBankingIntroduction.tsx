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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useSubmitPrivateBankingEnquiry } from '@workspace/api-client-react';

const formSchema = z.object({
  bankingRelationshipType: z.string().min(1, "Required"),
  investableWealth: z.string().min(1, "Required"),
  jurisdictions: z.array(z.string()).min(1, "Required"),
  reasons: z.array(z.string()).min(1, "Required"),
  timeline: z.string().min(1, "Required"),
  fullName: z.string().min(2, "Required"),
  countryOfResidence: z.string().min(1, "Required"),
  whatsappNumber: z.string().min(5, "Required"),
  emailAddress: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PrivateBankingIntroduction() {
  const [_, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const submitEnquiry = useSubmitPrivateBankingEnquiry();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { bankingRelationshipType: "", investableWealth: "", jurisdictions: [], reasons: [], timeline: "", fullName: "", countryOfResidence: "", whatsappNumber: "", emailAddress: "" }
  });

  const nextStep = async () => {
    let fieldToValidate: any = [];
    if (currentStep === 0) fieldToValidate = ['bankingRelationshipType'];
    if (currentStep === 1) fieldToValidate = ['investableWealth'];
    if (currentStep === 2) fieldToValidate = ['jurisdictions'];
    if (currentStep === 3) fieldToValidate = ['reasons'];
    if (currentStep === 4) fieldToValidate = ['timeline'];
    
    if (currentStep === 5) return;

    const isValid = await form.trigger(fieldToValidate);
    if (isValid) {
      setCurrentStep(s => Math.min(s + 1, 5));
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
        setLocation('/private-banking-success');
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-8 flex justify-between items-center max-w-5xl mx-auto w-full">
        <Logo theme="dark" />
        <Link href="/" className="text-white hover:text-white/80 text-sm font-medium">Return to Home</Link>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-24">
        <div className="text-center mb-8">
          <div className="text-xs font-bold tracking-[0.2em] text-white/70 mb-4 uppercase">Private Client Desk</div>
          <h1 className="text-4xl font-bold">Private Banking Introduction</h1>
        </div>

        <div className="w-full max-w-2xl bg-white text-[#000B2D] rounded-2xl p-8 sm:p-12 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* STEP 1 */}
              {currentStep === 0 && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">What Type Of Banking Relationship Are You Seeking?</h2>
                  <FormField control={form.control} name="bankingRelationshipType" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          {["Personal private banking", "Business banking", "Family office services", "Investment banking relationship", "Other"].map(opt => (
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
              )}

              {/* STEP 2 */}
              {currentStep === 1 && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">What Is Your Approximate Investable Wealth?</h2>
                  <FormField control={form.control} name="investableWealth" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          {["£250,000 - £1 million", "£1 million - £5 million", "£5 million - £25 million", "£25 million+", "Prefer not to disclose"].map(opt => (
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
              )}

              {/* STEP 3 - Checkboxes */}
              {currentStep === 2 && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">Which Jurisdictions Are You Interested In?</h2>
                  <FormField control={form.control} name="jurisdictions" render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {["UK", "Switzerland", "UAE", "Europe", "Caribbean", "Other"].map(item => (
                          <FormField key={item} control={form.control} name="jurisdictions" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-4 space-y-0 p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer">
                              <FormControl>
                                <Checkbox
                                  className="w-5 h-5 rounded border-gray-300 data-[state=checked]:bg-[#0F61E9] data-[state=checked]:border-[#0F61E9]"
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(field.value?.filter((val) => val !== item))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer flex-1">{item}</FormLabel>
                            </FormItem>
                          )} />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {/* STEP 4 - Checkboxes */}
              {currentStep === 3 && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">What Are Your Main Reasons For Seeking Private Banking?</h2>
                  <FormField control={form.control} name="reasons" render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {["Wealth management", "International banking access", "Asset protection planning", "Business requirements", "Credit/lending facilities", "Other"].map(item => (
                          <FormField key={item} control={form.control} name="reasons" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-4 space-y-0 p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer">
                              <FormControl>
                                <Checkbox
                                  className="w-5 h-5 rounded border-gray-300 data-[state=checked]:bg-[#0F61E9] data-[state=checked]:border-[#0F61E9]"
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(field.value?.filter((val) => val !== item))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer flex-1">{item}</FormLabel>
                            </FormItem>
                          )} />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {/* STEP 5 */}
              {currentStep === 4 && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">How Soon Are You Looking To Establish A Relationship?</h2>
                  <FormField control={form.control} name="timeline" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          {["Immediately", "Within 3 months", "3-12 months", "Exploring options"].map(opt => (
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
              )}

              {/* STEP 6 */}
              {currentStep === 5 && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <h2 className="text-2xl font-bold mb-6 leading-tight">A Few Details So The Desk Can Reach You.</h2>
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
                {currentStep < 5 ? (
                  <Button type="button" onClick={nextStep} className="bg-[#000B2D] hover:bg-[#000B2D]/90 text-white rounded-full px-8">
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={submitEnquiry.isPending} className="bg-[#000B2D] hover:bg-[#000B2D]/90 text-white rounded-full px-8">
                    {submitEnquiry.isPending ? 'Submitting...' : 'Submit Enquiry'} 
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

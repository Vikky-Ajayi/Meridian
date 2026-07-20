import { Shield, Target, Users, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">About Meridian</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            We are a specialist advisory firm dedicated to optimizing the global financial footprint of high-net-worth individuals and corporate entities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-blue">
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Founded on the principle that international finance should be seamless, transparent, and personalized, Meridian Advisory acts as the crucial bridge between our clients and the complex world of global banking and cross-border payments.
          </p>
          
          <h2 className="text-3xl font-bold text-foreground mt-16 mb-6">Our Philosophy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            In an increasingly borderless world, financial institutions have paradoxically become more rigid and siloed. Navigating foreign exchange markets, establishing international banking relationships, and moving substantial capital across borders requires specialized knowledge and established networks.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            We believe that true wealth management isn't just about accumulation—it's about mobility, security, and efficiency. By remaining independent, we align our interests entirely with our clients, scanning the market to provide solutions that standard retail or corporate banking simply cannot offer.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 my-16 not-prose">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">Integrity First</h3>
              <p className="text-gray-600 text-sm">We operate with complete transparency regarding fees, timelines, and risks. Trust is our primary currency.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <Target className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">Precision Execution</h3>
              <p className="text-gray-600 text-sm">In financial markets, timing and exactness matter. Our operational infrastructure is built for flawless execution.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mt-16 mb-6">The Meridian Process</h2>
          
          <div className="space-y-12 my-12 not-prose">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Discovery & Consultation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We begin by understanding your complete financial picture, jurisdictional requirements, timeframe, and ultimate objectives. This initial deep dive allows us to identify the precise institutions and corridors best suited for your needs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Structuring & Introduction</h3>
                <p className="text-gray-600 leading-relaxed">
                  Leveraging our established institutional network, we architect the optimal solution. Whether it's securing a competitive FX forward contract or presenting your profile to a select private bank, we handle the complex negotiation and structuring.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Execution & Ongoing Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  We oversee the entire onboarding and execution process to ensure smooth settlement. Post-transaction, your dedicated relationship manager remains your single point of contact for future requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

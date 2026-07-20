import { Link } from 'wouter';
import heroGlobe from '@/assets/hero-globe-desktop.png';
import worldMap from '@/assets/world-map.png';

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="bg-[#000B2D] text-white pt-32 pb-0 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-sm font-bold tracking-[0.2em] text-white/70 mb-6 uppercase">Private Client Desk</div>
          <h1 className="text-[56px] font-[600] tracking-[-0.04em] leading-[1.15] mb-8">
            Move Significant Capital Across Borders, On Your Terms.
          </h1>
          <p className="text-[18px] font-[500] text-white/70 max-w-3xl mx-auto leading-relaxed mb-12">
            A dedicated desk for large-value international transfers, property purchases, business sales, relocations, portfolio consolidation, priced and executed like an institutional treasury, not a retail wire.
          </p>
        </div>
        <div className="w-full max-w-[800px] mx-auto mt-8 overflow-hidden flex justify-center relative">
          <img src={heroGlobe} alt="Global network" className="w-full h-auto object-cover translate-y-[10%]" />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div>
              <div className="text-4xl font-bold mb-2 text-[#000B2D]">190+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-[#000B2D]">50+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Currencies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-[#000B2D]">$50M+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Single transfer capacity</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-[#000B2D]">Tier-1</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Superior Level B1</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHEN THE AMOUNT IS TOO LARGE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-bold text-[#0F61E9] uppercase tracking-widest mb-4">Large Capital Movement</h2>
            <h3 className="text-4xl font-bold text-[#000B2D]">When The Amount Is Too Large For A Retail Wire.</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Property investments",
              "Business sale or acquisition",
              "Relocation & residence programs",
              "Portfolio consolidation",
              "Other business or personal reasons",
              "Private client transfers"
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center h-32">
                <h4 className="text-xl font-semibold text-[#000B2D]">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section className="py-24 bg-[#000B2D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-6">The Solution</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              We bridge the gap between traditional private banking and modern cross-border financial technology, providing bespoke liquidity solutions for significant capital.
            </p>
          </div>
          <div className="space-y-8">
            {[
              { title: "Personalised international banking", desc: "Dedicated accounts in your name across multiple jurisdictions." },
              { title: "Treasury & foreign exchange", desc: "Access to institutional FX rates and hedging instruments." },
              { title: "Deposit & asset safeguarding", desc: "Client funds held securely at Tier-1 global institutions." },
              { title: "Privacy through virtual assets", desc: "Modern settlement infrastructure built for discretion." }
            ].map((feature, i) => (
              <div key={i} className="border-t border-white/10 pt-6">
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLD MAP */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={worldMap} alt="World Map" className="w-full max-w-5xl mx-auto mb-16 opacity-90" />
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 border-t border-gray-200 pt-12">
            <div>
              <div className="text-2xl font-bold text-[#000B2D] mb-2">150+ CORRESPONDENT BANKING NETWORKS</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-[#000B2D] mb-2">SETTLEMENTS T+0 TO T+1</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

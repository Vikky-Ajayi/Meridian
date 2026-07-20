import { Link } from 'wouter';
import { Logo } from '@/components/ui/Logo';

export default function PrivateBankingSuccess() {
  const result = JSON.parse(sessionStorage.getItem('meridian_enquiry_result') || '{}');
  const refNumber = result?.referenceNumber || 'PB-88492';
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="px-6 py-8 flex justify-between items-center max-w-5xl mx-auto w-full">
        <Logo theme="dark" />
        <Link href="/" className="text-white hover:text-white/80 text-sm font-medium">Return to Home</Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl text-center max-w-md w-full">
          <div className="inline-block bg-black/5 text-black text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase mb-6">
            INTRODUCTION BEING ARRANGED
          </div>
          <h1 className="text-3xl font-bold text-[#000B2D] mb-4">Your Introduction Is Being Arranged</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our wealth structuring team is reviewing your profile to identify the optimal institutional match. We will contact you shortly to discuss next steps.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Reference Number</div>
            <div className="text-xl font-mono font-bold text-[#000B2D]">{refNumber}</div>
          </div>

          <Link href="/">
            <button className="w-full bg-[#000B2D] hover:bg-[#000B2D]/90 text-white font-medium py-4 rounded-full transition-colors">
              Return to Homepage
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

import { Link } from 'wouter';
import { Logo } from '@/components/ui/Logo';

export default function MoveMoneySuccess() {
  const result = JSON.parse(sessionStorage.getItem('meridian_enquiry_result') || '{}');
  const refNumber = result?.referenceNumber || 'MRD-10294';
  
  return (
    <div className="min-h-screen bg-[#0F61E9] text-white flex flex-col font-sans">
      <header className="px-6 py-8 flex justify-between items-center max-w-5xl mx-auto w-full">
        <Logo theme="dark" />
        <Link href="/" className="text-white hover:text-white/80 text-sm font-medium">Return to Home</Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl text-center max-w-md w-full">
          <div className="inline-block bg-[#0F61E9]/10 text-[#0F61E9] text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase mb-6">
            ENQUIRY LOGGED
          </div>
          <h1 className="text-3xl font-bold text-[#000B2D] mb-4">Your Line To The Desk Is Open</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We have received your transfer details. Our specialized desk is reviewing your requirements and will reach out to establish your private channel.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Reference Number</div>
            <div className="text-xl font-mono font-bold text-[#000B2D]">{refNumber}</div>
          </div>

          <a 
            href={result?.whatsappLink || '#'} 
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-black hover:bg-gray-900 text-white font-medium py-4 rounded-full transition-colors"
          >
            Message the Desk on WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}

import { Navbar } from '@/components/layout/Navbar';

export default function PrivateBankingSuccess() {
  let result: Record<string, any> = {};
  try { result = JSON.parse(sessionStorage.getItem('meridian_enquiry_result') || '{}'); } catch {}

  const refNumber = result?.referenceNumber || 'PBI-20260717-1639';
  const fullName  = result?.fullName || '';

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col">
      <Navbar />

      {/* Decorative rectangles */}
      <div className="fixed bottom-0 left-0 pointer-events-none select-none z-0">
        <div className="w-[140px] h-[320px] bg-[#1a1a1a] ml-4 mb-0" />
        <div className="w-[140px] h-[260px] bg-[#1a1a1a] absolute bottom-0 left-[170px]" />
        <div className="w-[140px] h-[200px] bg-[#1a1a1a] absolute bottom-0 left-[336px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-4 relative z-10">
        {/* Page header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase mb-3">Private Client Desk</p>
          <h1 className="text-[36px] font-semibold text-white leading-tight">Private Banking Introduction</h1>
        </div>

        {/* Card */}
        <div className="w-full max-w-[520px] bg-white rounded-xl shadow-lg px-8 py-10 text-center">
          {/* Badge icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-[#0F61E9] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z"/>
              </svg>
            </div>
          </div>

          <p className="text-xs font-bold tracking-[0.18em] text-[#0F61E9] uppercase mb-3">Enquiry Logged</p>
          <h2 className="text-[22px] font-bold text-[#000B2D] mb-3 leading-snug">Your Introduction Is Being Arranged</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            A private client associate has your details and will reach out directly to arrange your introduction. Quote your reference if asked.
          </p>

          <div className="border-t border-gray-100 my-5" />

          <div className="flex justify-between items-center text-sm text-[#000B2D] px-1">
            <span><span className="text-gray-400">Reference:</span> <span className="font-semibold">{refNumber}</span></span>
            {fullName && <span className="font-medium">{fullName}</span>}
          </div>

          <div className="border-t border-gray-100 my-5" />

          <p className="text-sm font-semibold text-[#000B2D] mb-2">We'll be in touch at as soon as possible</p>
          <p className="text-xs text-gray-400">Available 08:00–20:00 GMT, Monday to Friday.</p>
        </div>
      </main>
    </div>
  );
}

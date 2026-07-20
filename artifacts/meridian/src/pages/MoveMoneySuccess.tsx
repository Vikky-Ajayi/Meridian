import { Navbar } from '@/components/layout/Navbar';

export default function MoveMoneySuccess() {
  let result: Record<string, any> = {};
  try { result = JSON.parse(sessionStorage.getItem('meridian_enquiry_result') || '{}'); } catch {}

  const refNumber = result?.referenceNumber || 'MMA-20260717-1639';
  const fullName  = result?.fullName || '';
  const whatsappLink   = result?.whatsappLink || '#';
  const whatsappNumber = result?.whatsappNumber || '+44 7000 000000';

  return (
    <div className="min-h-screen bg-[#0F61E9] font-sans flex flex-col">
      <Navbar />

      {/* Decorative rectangles */}
      <div className="fixed bottom-0 left-0 pointer-events-none select-none z-0">
        <div className="w-[140px] h-[320px] bg-[#0052CC] opacity-60 ml-4 mb-0" />
        <div className="w-[140px] h-[260px] bg-[#0052CC] opacity-40 absolute bottom-0 left-[170px]" />
        <div className="w-[140px] h-[200px] bg-[#0052CC] opacity-30 absolute bottom-0 left-[336px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-4 relative z-10">
        {/* Page header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/80 uppercase mb-3">Private Client Desk</p>
          <h1 className="text-[36px] font-semibold text-white leading-tight">Move Money Abroad</h1>
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
          <h2 className="text-[22px] font-bold text-[#000B2D] mb-3 leading-snug">Your Line To The Desk Is Open</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            A private client associate has your details and will pick up the conversation directly on WhatsApp. Quote your reference if asked.
          </p>

          <div className="border-t border-gray-100 my-5" />

          <div className="flex justify-between items-center text-sm text-[#000B2D] px-1">
            <span><span className="text-gray-400">Reference:</span> <span className="font-semibold">{refNumber}</span></span>
            {fullName && <span className="font-medium">{fullName}</span>}
          </div>

          <div className="border-t border-gray-100 my-5" />

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-black text-white text-sm font-semibold py-3.5 hover:bg-black/85 transition-colors mb-4"
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message the Desk on WhatsApp
          </a>

          <p className="text-base font-semibold text-[#000B2D] mb-1">{whatsappNumber}</p>
          <p className="text-xs text-gray-400">Available 08:00–20:00 GMT, Monday to Friday.</p>
        </div>
      </main>
    </div>
  );
}

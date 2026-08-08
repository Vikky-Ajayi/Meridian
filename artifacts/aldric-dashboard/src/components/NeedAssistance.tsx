import { WhatsAppButton } from './WhatsAppButton';

export function NeedAssistance() {
  return (
    <div className="bg-[#0D1B3E] rounded-xl px-8 py-8 flex items-center justify-between gap-4 mt-8">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Need assistance?</h3>
        <p className="text-gray-400 text-sm leading-snug">
          Questions about your submission? Our team responds directly<br className="hidden sm:block" /> on WhatsApp.
        </p>
      </div>
      <WhatsAppButton className="flex-shrink-0" />
    </div>
  );
}

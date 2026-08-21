import { WhatsAppButton } from './WhatsAppButton';

export function NeedAssistance() {
  return (
    <div className="bg-[#07133C] rounded-xl md:rounded-2xl px-5 py-7 md:px-14 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-8 mt-8 md:mt-10">
      <div>
        <h3 className="text-white font-bold text-[24px] mb-4 tracking-[-0.03em]">Need assistance?</h3>
        <p className="text-white text-sm leading-snug">
          Questions about your submission? Our team responds directly<br className="hidden sm:block" /> on WhatsApp.
        </p>
      </div>
      <WhatsAppButton className="flex w-full justify-center md:inline-flex md:w-auto md:flex-shrink-0" />
    </div>
  );
}

import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, Props>(({ label, className = '', ...props }, ref) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-[#F5F6FA]">
      <span className="px-3 flex-shrink-0 flex items-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="12" cy="12" r="12" fill="#22C55E"/>
          <path d="M8 8h8v8H8z" fill="#fff"/>
          <path d="M8 10h8M8 14h8" stroke="#22C55E" strokeWidth="1.5"/>
        </svg>
      </span>
      <input
        ref={ref}
        type="tel"
        className={`flex-1 px-2 text-sm outline-none h-full bg-transparent placeholder:text-gray-400 ${className}`}
        {...props}
      />
    </div>
  </div>
));
PhoneInput.displayName = 'PhoneInput';

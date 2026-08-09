import { useState } from 'react';

interface PublicFormSelectProps {
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function PublicFormSelect({
  options,
  placeholder,
  value,
  onChange,
}: PublicFormSelectProps) {
  const [open, setOpen] = useState(false);

  const selected = value || placeholder;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-11 px-4 pr-10 text-left text-[14px] font-medium leading-[1.4] bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none transition-colors focus:border-[#0F61E9] ${
          value ? 'text-[#0b1733]' : 'text-gray-400'
        }`}
      >
        {selected}
      </button>
      <span className="absolute right-3 top-[22px] -translate-y-1/2 pointer-events-none text-gray-400">
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-xl bg-white p-2 shadow-[0_18px_42px_rgba(15,23,42,0.2)]">
          {options.map((option, index) => {
            const active = value ? option === value : index === 0;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`block w-full rounded-md px-3 py-2.5 text-left text-[14px] font-medium leading-[1.35] text-[#111827] transition-colors hover:bg-[#E6F1FF] ${
                  active ? 'bg-[#DCEBFF]' : ''
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

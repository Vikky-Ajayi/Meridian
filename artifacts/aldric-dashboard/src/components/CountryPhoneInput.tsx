import { useState, useRef, useEffect } from 'react';
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '@/lib/countries';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CountryPhoneInput({ value, onChange, placeholder = '0000 000 0000' }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Country>(DEFAULT_COUNTRY);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  const flagUrl = (country: Country) =>
    `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-[#F5F6FA] focus-within:border-[#0F61E9] transition-colors">
        {/* Country selector trigger */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 h-full border-r border-gray-200 flex-shrink-0 hover:bg-gray-100 transition-colors"
        >
          <img
            src={flagUrl(selected)}
            alt={`${selected.name} flag`}
            width="20"
            height="15"
            className="w-5 h-[15px] object-cover rounded-[2px] flex-shrink-0"
          />
          <span className="text-[13px] font-medium text-gray-600 tabular-nums">{selected.dial}</span>
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* Number input */}
        <input
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] outline-none h-full bg-transparent placeholder:text-gray-400"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-[13px] bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0F61E9] transition-colors"
            />
          </div>

          {/* List */}
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-[13px] text-gray-400 text-center">No results</li>
            ) : filtered.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { setSelected(c); setOpen(false); setSearch(''); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left transition-colors ${selected.code === c.code ? 'bg-blue-50' : ''}`}
                >
                  <img
                    src={flagUrl(c)}
                    alt={`${c.name} flag`}
                    width="20"
                    height="15"
                    loading="lazy"
                    className="w-5 h-[15px] object-cover rounded-[2px] flex-shrink-0"
                  />
                  <span className="flex-1 text-[13px] text-gray-800 truncate">{c.name}</span>
                  <span className="text-[12px] text-gray-400 tabular-nums flex-shrink-0">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

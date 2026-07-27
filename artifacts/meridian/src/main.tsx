import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// In production the API lives at a separate origin; configure it via VITE_API_BASE_URL.
// In dev the API is served relative to this origin (same Replit proxy domain).
const apiUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (apiUrl) {
  // Normalise: if the env var was set without a protocol (e.g. "example.railway.app"
  // instead of "https://example.railway.app") the browser treats it as a relative
  // path on the current origin and the request never leaves the frontend host.
  // Always ensure an absolute HTTPS URL.
  const normalized = /^https?:\/\//i.test(apiUrl) ? apiUrl : `https://${apiUrl}`;
  setBaseUrl(normalized);
}

createRoot(document.getElementById('root')!).render(<App />);

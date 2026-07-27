import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// In production the API lives at a separate origin; configure it via VITE_API_BASE_URL.
// In dev the API is served relative to this origin (same Replit proxy domain).
const apiUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById('root')!).render(<App />);

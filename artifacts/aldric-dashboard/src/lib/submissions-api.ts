const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface DashboardCapability {
  id: string;
  fullName?: string;
  contactEmail?: string;
  category: string;
  title: string;
  status: string;
  dateSubmitted: string;
  reference: string;
  geography: string;
  dealSize: string;
  description: string;
  priorExperience?: string;
}

export interface DashboardRequirement {
  id: string;
  fullName?: string;
  contactEmail?: string;
  category: string;
  title: string;
  status: string;
  dateSubmitted: string;
  reference: string;
  geography: string;
  dealSize: string;
  description: string;
  timeline: string;
}

async function postSubmission(path: string, body: unknown) {
  const res = await fetch(`${API_BASE_URL}/api/aldric-submissions/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Submission failed. Please try again.";
    try {
      const data = await res.json();
      if (typeof data?.error === "string") message = data.error;
    } catch {
      // Keep generic error.
    }
    throw new Error(message);
  }

  return res.json() as Promise<{ referenceNumber: string; type: string }>;
}

export function submitCapability(body: unknown) {
  return postSubmission("capabilities", body);
}

export function submitRequirement(body: unknown) {
  return postSubmission("requirements", body);
}

export async function getDashboardSubmissions(email?: string) {
  const params = email ? `?email=${encodeURIComponent(email)}` : "";
  const res = await fetch(`${API_BASE_URL}/api/aldric-submissions${params}`);
  if (!res.ok) {
    throw new Error("Failed to load submissions.");
  }
  return res.json() as Promise<{
    capabilities: DashboardCapability[];
    requirements: DashboardRequirement[];
  }>;
}

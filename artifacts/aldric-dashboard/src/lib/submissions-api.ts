const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

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

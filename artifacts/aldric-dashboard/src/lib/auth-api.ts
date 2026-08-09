const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function postAuth(path: string, body: unknown) {
  const res = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Request failed. Please try again.";
    try {
      const data = await res.json();
      if (typeof data?.error === "string") message = data.error;
    } catch {
      // Keep generic message.
    }
    throw new Error(message);
  }

  return res.json() as Promise<{ ok: true }>;
}

export function sendOtp(email: string) {
  return postAuth("send-otp", { email });
}

export function verifyOtp(email: string, otp: string) {
  return postAuth("verify-otp", { email, otp });
}

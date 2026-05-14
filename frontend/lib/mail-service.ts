const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function sendLure(to: string) {
  const res = await fetch(`${API_URL}/email/lure`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to }),
  });
  return res.json();
}

export async function sendFollowup(to: string, sessionId: string) {
  const res = await fetch(`${API_URL}/email/followup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, sessionId }),
  });
  return res.json();
}

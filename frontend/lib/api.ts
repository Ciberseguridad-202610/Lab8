const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type ActionType = 'PAGE_VISIT' | 'FORM_SUBMIT' | 'LINK_CLICK';

export async function logInteraction(sessionId: string, action: ActionType): Promise<void> {
  try {
    await fetch(`${API_URL}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action }),
    });
  } catch {
    // No bloqueamos el flujo si el backend no está disponible
  }
}

export async function getStats() {
  const res = await fetch(`${API_URL}/interactions/stats`, { cache: 'no-store' });
  return res.json();
}

export async function getInteractions() {
  const res = await fetch(`${API_URL}/interactions`, { cache: 'no-store' });
  return res.json();
}

export async function sendFollowup(to: string, sessionId: string) {
  const res = await fetch(`${API_URL}/email/followup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, sessionId }),
  });
  return res.json();
}

export async function purgeInteractions() {
  const res = await fetch(`${API_URL}/interactions/purge`, { method: 'DELETE' });
  return res.json();
}

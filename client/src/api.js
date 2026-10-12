// The API's address, e.g. https://your-api.onrender.com (empty in dev: Vite proxies /api).
const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${API}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export const api = {
  content: () => request('/content'),
  signatures: () => request('/guestbook'),
  sign: (body) => request('/guestbook', { method: 'POST', body: JSON.stringify(body) }),
  send: (body) => request('/messages', { method: 'POST', body: JSON.stringify(body) }),
};

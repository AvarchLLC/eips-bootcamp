const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://143.244.213.59:4003';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('x-api-key', process.env.INTERNAL_API_KEY || 'dev-secret-key');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}
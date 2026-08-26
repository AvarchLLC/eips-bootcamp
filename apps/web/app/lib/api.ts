export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
}

export function getInternalApiKey(): string {
  return process.env.INTERNAL_API_KEY || 'dev-secret-key';
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('x-api-key', getInternalApiKey());

  const res = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}
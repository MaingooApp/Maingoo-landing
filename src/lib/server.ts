// Helpers shared by the landing's Vercel functions (/api/chat, /api/contact).

// Trimmed: values pasted into Vercel often carry a trailing space or line break
export const env = (name: string): string | undefined => (process.env[name] ?? import.meta.env[name])?.trim() || undefined;

export const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });

const ALLOWED_ORIGINS = new Set(["https://maingoo.tech", "https://www.maingoo.tech"]);

export function allowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  let host: string;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  if (import.meta.env.DEV) return host === "localhost" || host === "127.0.0.1";
  // Vercel previews of this project
  return host === "maingoo-landing.vercel.app" || host.endsWith("-maingoo-project.vercel.app");
}

// shortcut: per-instance memory, so the limit resets on cold starts; move it to Vercel Firewall rate limiting if abused
export function rateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (ip: string): boolean => {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((time) => now - time < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > max;
  };
}

export const clientIp = (request: Request, fallback: string) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || fallback;

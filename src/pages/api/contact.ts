// Contact form: Vercel function that checks reCAPTCHA and sends the lead to the team with Resend.
import type { APIRoute } from "astro";
import { allowedOrigin, clientIp, env, jsonError as error, rateLimiter } from "../../lib/server";

export const prerender = false;

const rateLimited = rateLimiter(5, 10 * 60 * 1000);

// Field, label in the email and max length (same limits as the form)
const FIELDS = [
  ["from_name", "Nombre", 80],
  ["from_email", "Email", 100],
  ["phone", "Teléfono", 40],
  ["location", "Ubicación", 100],
  ["business_type", "Tipo de negocio", 120],
  ["restaurant_size", "Número de negocios", 40],
  ["message", "Mensaje", 500],
] as const;
type Lead = Record<(typeof FIELDS)[number][0], string>;

export function parseLead(body: unknown): Lead | null {
  const data = (body ?? {}) as Record<string, unknown>;
  const lead = {} as Lead;
  for (const [name, , max] of FIELDS) {
    const value = data[name];
    if (typeof value !== "string" || !value.trim() || value.length > max) return null;
    lead[name] = value.trim();
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.from_email) ? lead : null;
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

async function recaptchaOk(token: unknown, ip: string): Promise<boolean> {
  const secret = env("RECAPTCHA_SECRET_KEY");
  // Locally the site key only works on maingoo.tech, so the check is skipped in dev without a secret
  if (!secret) return import.meta.env.DEV;
  if (typeof token !== "string" || !token) return false;
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok && ((await response.json()) as { success?: boolean }).success);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!allowedOrigin(request.headers.get("origin"))) return error(403, "Origen no permitido");
  const apiKey = env("RESEND_API_KEY");
  const to = env("CONTACT_TO_EMAIL") ?? "hello@maingoo.tech";
  const from = env("CONTACT_FROM_EMAIL") ?? "Maingoo <web@correo.maingoo.tech>";
  if (!apiKey) return error(503, "El formulario no está configurado");

  const ip = clientIp(request, clientAddress);
  if (rateLimited(ip)) return error(429, "Demasiados envíos seguidos. Prueba en unos minutos.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error(400, "Datos no válidos");
  }
  const lead = parseLead(body);
  if (!lead) return error(400, "Datos no válidos");
  if (!(await recaptchaOk((body as { recaptcha?: unknown }).recaptcha, ip))) {
    return error(400, "No se pudo verificar el captcha");
  }

  const rows = FIELDS.map(([name, label]) => [label, lead[name]] as const);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.from_email,
      subject: `Nuevo contacto en la web: ${lead.from_name}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      html: `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
        .map(([label, value]) => `<tr><th align="left" valign="top">${label}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
        .join("")}</table>`,
    }),
    signal: AbortSignal.timeout(15_000),
  }).catch((reason: unknown) => {
    console.error("[contact] no se pudo llamar a Resend:", reason instanceof Error ? reason.message : reason);
    return null;
  });
  if (!response?.ok) {
    if (response) console.error(`[contact] Resend respondió ${response.status}:`, (await response.text()).slice(0, 300));
    return error(502, "No se pudo enviar el mensaje");
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
};

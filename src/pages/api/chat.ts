// Landing chatbot: Vercel function that sends the conversation to GPT-6 Luna in Azure
// (resource maingoo-landing-ai) and streams the answer back as plain text.
import type { APIRoute } from "astro";
import { SYSTEM_PROMPT } from "../../lib/chat-context";

export const prerender = false;

const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;
const MAX_OUTPUT_TOKENS = 700;
const ALLOWED_ORIGINS = new Set(["https://maingoo.tech", "https://www.maingoo.tech"]);

// shortcut: per-instance memory, so the limit resets on cold starts; move it to Vercel Firewall rate limiting if abused
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

type ChatMessage = { role: "user" | "assistant"; content: string };

const env = (name: string): string | undefined => process.env[name] ?? import.meta.env[name];
const error = (status: number, message: string) =>
  new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });

function allowedOrigin(origin: string | null): boolean {
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

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export function parseMessages(body: unknown): ChatMessage[] | null {
  const list = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(list) || list.length === 0) return null;
  const messages = list.slice(-MAX_MESSAGES).map((item) => {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    return text ? { role, content: text } : null;
  });
  if (messages.some((message) => !message)) return null;
  const valid = messages as ChatMessage[];
  return valid[valid.length - 1].role === "user" ? valid : null;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!allowedOrigin(request.headers.get("origin"))) return error(403, "Origen no permitido");
  const endpoint = env("AZURE_LANDING_AI_ENDPOINT");
  const key = env("AZURE_LANDING_AI_KEY");
  if (!endpoint || !key) return error(503, "El chat no está configurado");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress;
  if (rateLimited(ip)) return error(429, "Demasiados mensajes seguidos. Prueba en unos minutos.");

  let messages: ChatMessage[] | null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return error(400, "Mensaje no válido");

  const upstream = await fetch(`${endpoint.replace(/\/$/, "")}/openai/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": key },
    body: JSON.stringify({
      model: env("AZURE_LANDING_AI_DEPLOYMENT") ?? "gpt-6-luna-landing",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_completion_tokens: MAX_OUTPUT_TOKENS,
      stream: true,
    }),
    signal: AbortSignal.timeout(45_000),
  }).catch(() => null);
  // Azure's content filter blocks jailbreak attempts with a 400: answer as the assistant would.
  if (upstream?.status === 400 && (await upstream.text()).includes("content_filter")) {
    return new Response("Solo puedo ayudarte con dudas sobre Maingoo. ¿Qué te gustaría saber de la app?", {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (!upstream?.ok || !upstream.body) return error(502, "El asistente no está disponible ahora mismo");

  // Azure answers with server-sent events; the widget only needs the text deltas.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const text = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.startsWith("data:") ? line.slice(5).trim() : "";
          if (!data || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // Partial or non-JSON keep-alive lines are skipped.
          }
        }
      },
    })
  );
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
};

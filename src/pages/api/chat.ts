// Landing chatbot: Vercel function that sends the conversation to GPT-6 Luna in Azure
// (resource maingoo-landing-ai) and streams the answer back as plain text.
import type { APIRoute } from "astro";
import { SYSTEM_PROMPT } from "../../lib/chat-context";
import { allowedOrigin, clientIp, env, jsonError as error, rateLimiter } from "../../lib/server";

export const prerender = false;

const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;
const MAX_OUTPUT_TOKENS = 700;
const rateLimited = rateLimiter(20, 10 * 60 * 1000);

type ChatMessage = { role: "user" | "assistant"; content: string };

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

  const ip = clientIp(request, clientAddress);
  if (rateLimited(ip)) return error(429, "Demasiados mensajes seguidos. Prueba en unos minutos.");

  let messages: ChatMessage[] | null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return error(400, "Mensaje no válido");

  // Accepts the endpoint with or without https:// or a trailing path, as pasted from the Azure portal
  let base: string;
  try {
    base = new URL(/^https?:\/\//.test(endpoint) ? endpoint : `https://${endpoint}`).origin;
  } catch {
    console.error("[chat] AZURE_LANDING_AI_ENDPOINT no es una URL válida");
    return error(503, "El chat no está configurado");
  }
  const upstream = await fetch(`${base}/openai/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": key },
    body: JSON.stringify({
      model: env("AZURE_LANDING_AI_DEPLOYMENT") ?? "gpt-6-luna-landing",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_completion_tokens: MAX_OUTPUT_TOKENS,
      stream: true,
    }),
    signal: AbortSignal.timeout(45_000),
  }).catch((reason: unknown) => {
    console.error("[chat] no se pudo llamar a Azure:", reason instanceof Error ? reason.message : reason);
    return null;
  });
  if (!upstream) return error(502, "El asistente no está disponible ahora mismo");
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    // Azure's content filter blocks jailbreak attempts with a 400: answer as the assistant would.
    if (upstream.status === 400 && detail.includes("content_filter")) {
      return new Response("Solo puedo ayudarte con dudas sobre Maingoo. ¿Qué te gustaría saber de la app?", {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
    console.error(`[chat] Azure respondió ${upstream.status}:`, detail.slice(0, 300));
    return error(502, "El asistente no está disponible ahora mismo");
  }

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

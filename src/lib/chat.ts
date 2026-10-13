import { providerById } from "./providers";
import type { AppSettings } from "./storage";

export interface ChatRequest {
  system: string;
  user: string;
}

export class ChatError extends Error {
  constructor(
    message: string,
    readonly hint?: string,
  ) {
    super(message);
  }
}

/** Removes common LLM preamble/quoting wrappers so the result is send-ready. */
export function cleanOutput(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
  text = text.replace(
    /^(rewritten message|rewritten|output|message|here(?:'s| is) (?:the |your )?(?:rewritten )?message)\s*[:\-–]\s*/i,
    "",
  );
  text = text.replace(
    /^(sure|certainly|of course)[^.:\n]*[.:]\s*/i,
    "",
  );
  // unwrap a single fully-quoted block
  const quoted = text.match(/^["“]([\s\S]*?)["”]$/);
  if (quoted) text = quoted[1].trim();
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

export async function rewrite(
  req: ChatRequest,
  settings: AppSettings,
  signal?: AbortSignal,
): Promise<string> {
  const def = providerById(settings.provider);
  const baseUrl = (settings.baseUrl || def.baseUrl).trim();
  if (!baseUrl) {
    throw new ChatError(
      "No endpoint set",
      "Add a base URL in Settings → Custom endpoint.",
    );
  }

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal,
    body: JSON.stringify({
      provider: settings.provider,
      baseUrl,
      model: settings.model || def.defaultModel,
      apiKey: settings.sendKeyWithRequest ? settings.apiKey : "",
      temperature: settings.temperature,
      ...req,
    }),
  });

  const data = await res.json().catch(() => ({}) as Record<string, unknown>);

  if (!res.ok) {
    throw new ChatError(
      (data.error as string) || `Request failed (${res.status})`,
      data.hint as string | undefined,
    );
  }
  const text = cleanOutput((data.text as string) ?? "");
  if (!text) {
    throw new ChatError(
      "The model returned an empty response.",
      "Try a different model, or lower the softening level and regenerate.",
    );
  }
  return text;
}

export function testConnection(settings: AppSettings, signal?: AbortSignal) {
  return rewrite(
    {
      system:
        "Reply with exactly one short friendly word. No punctuation, no quotes.",
      user: "Say hello.",
    },
    { ...settings, temperature: 0.2 },
    signal,
  );
}
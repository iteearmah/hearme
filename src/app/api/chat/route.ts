import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  provider?: string;
  baseUrl?: string;
  model?: string;
  apiKey?: string;
  temperature?: number;
  system?: string;
  user?: string;
};

/**
 * Server-side keys, so a deployment can work with zero configuration from the
 * visitor. The client never ships or needs to know about these.
 */
const ENV_KEYS: Record<string, string> = {
  opencode: "OPENCODE_API_KEY",
  groq: "GROQ_API_KEY",
  gemini: "GEMINI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  pollinations: "POLLINATIONS_API_KEY",
  custom: "CUSTOM_API_KEY",
};

const DEFAULTS: Record<string, { baseUrl: string; model: string }> = {
  pollinations: {
    baseUrl: "https://text.pollinations.ai/openai",
    model: "openai-fast",
  },
  opencode: {
    baseUrl: "https://opencode.ai/inference/v1/chat/completions",
    model: "cat-jam-free",
  },
  ollama: {
    baseUrl: "http://localhost:11434/v1/chat/completions",
    model: "llama3.2",
  },
  lmstudio: {
    baseUrl: "http://localhost:1234/v1/chat/completions",
    model: "local-model",
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
  },
  gemini: {
    baseUrl:
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-2.5-flash",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    model: "meta-llama/llama-3.3-70b-instruct:free",
  },
  custom: { baseUrl: "", model: "" },
};

const PRIVATE_HOST =
  /^(localhost|127\.|0\.0\.0\.0|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function hintFor(provider: string, status: number, body: string) {
  const b = body.toLowerCase();
  if (status === 401 || status === 403) {
    if (provider === "opencode")
      return "OpenCode's free models still require a key from opencode.ai/console. Add it in Settings, or switch to Pollinations/Ollama.";
    return "That key was rejected. Check it in Settings, or switch to a keyless provider (Pollinations / Ollama).";
  }
  if (status === 429)
    return "Rate limited by the provider. Wait a moment, or switch provider in Settings.";
  if (status === 404)
    return "That model or endpoint does not exist. Pick another model in Settings.";
  if (b.includes("fetch failed") || b.includes("econnrefused"))
    return "Could not reach that endpoint. For Ollama/LM Studio it must be running and reachable from the server.";
  return undefined;
}

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const provider = body.provider ?? "pollinations";
  const fallback = DEFAULTS[provider] ?? DEFAULTS.pollinations;
  const baseUrl = (body.baseUrl || fallback.baseUrl).trim();
  const model = (body.model || fallback.model).trim();
  const system = (body.system || "").slice(0, 8000);
  const user = (body.user || "").slice(0, 12000);

  if (!baseUrl) return json({ error: "No endpoint configured" }, 400);
  if (!model) return json({ error: "No model configured" }, 400);
  if (!user) return json({ error: "Nothing to send" }, 400);

  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return json({ error: `Invalid endpoint URL: ${baseUrl}` }, 400);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return json({ error: "Endpoint must be http(s)" }, 400);
  }
  // A public deployment must not become an open proxy / SSRF pivot.
  if (
    process.env.ALLOW_PRIVATE_ENDPOINTS !== "1" &&
    PRIVATE_HOST.test(url.hostname)
  ) {
    return json(
      {
        error: "Private/local endpoints are disabled on this deployment",
        hint: "Local Ollama/LM Studio only works when self-hosted, or set ALLOW_PRIVATE_ENDPOINTS=1.",
      },
      403,
    );
  }

  const apiKey =
    (body.apiKey || "").trim() || process.env[ENV_KEYS[provider] ?? ""] || "";

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  if (provider === "openrouter") {
    headers["http-referer"] =
      process.env.PUBLIC_SITE_URL || "https://hearme.vercel.app";
    headers["x-title"] = "HearMe";
  }

  const temperature =
    typeof body.temperature === "number"
      ? Math.max(0, Math.min(1.5, body.temperature))
      : 0.9;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  try {
    const upstream = await fetch(url.toString(), {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: 700,
        stream: false,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: user },
        ],
      }),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      return json(
        {
          error: `Provider error ${upstream.status}`,
          hint: hintFor(provider, upstream.status, text),
          detail: text.slice(0, 400),
        },
        502,
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return json(
        { error: "Provider returned non-JSON", detail: text.slice(0, 200) },
        502,
      );
    }

    const choices = parsed.choices as
      | { message?: { content?: string }; text?: string }[]
      | undefined;
    const content =
      choices?.[0]?.message?.content ??
      choices?.[0]?.text ??
      (parsed.content as string | undefined) ??
      (parsed.response as string | undefined) ??
      "";

    if (typeof content !== "string" || !content.trim()) {
      return json(
        { error: "Empty completion", detail: text.slice(0, 200) },
        502,
      );
    }

    return json({ text: content.trim(), model: parsed.model ?? model });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const aborted = message.includes("abort");
    return json(
      {
        error: aborted
          ? "The provider took too long to respond"
          : "Could not reach the provider",
        hint: aborted
          ? "Local models can be slow. Try again, or use a faster provider."
          : "Check the endpoint URL and your connection.",
        detail: message,
      },
      502,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function GET() {
  return json({ error: "Use POST" }, 405);
}
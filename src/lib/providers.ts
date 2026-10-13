export type ProviderId =
  | "pollinations"
  | "opencode"
  | "ollama"
  | "lmstudio"
  | "groq"
  | "gemini"
  | "openrouter"
  | "custom";

export interface ProviderDef {
  id: ProviderId;
  name: string;
  tagline: string;
  /** true = works with no API key at all */
  keyless: boolean;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  keyLabel?: string;
  keyHelp?: string;
  keyPlaceholder?: string;
  /** server-side env var that can supply the key for deployments */
  envKey?: string;
  notes?: string;
}

const OPENCODE_FREE = [
  "cat-jam-free",
  "space-bunny-free",
  "big-pickle",
  "exo-free",
  "mimo-v2.6-flash-free",
  "ling-3.1-flash-free",
  "nemotron-3.5-lightning-free",
  "longcat-2.5-preview-free",
  "step-5-preview-free",
  "muse-spark-1.3-contributor-free",
];

export const PROVIDERS: ProviderDef[] = [
  {
    id: "pollinations",
    name: "Pollinations",
    tagline: "No signup, no key, works instantly",
    keyless: true,
    baseUrl: "https://text.pollinations.ai/openai",
    defaultModel: "openai-fast",
    models: ["openai-fast", "openai", "qwen-coder", "mistral", "llama"],
    notes:
      "Free community inference, anonymous tier. Rate limits apply. Best default for a zero-setup install.",
  },
  {
    id: "opencode",
    name: "OpenCode Zen",
    tagline: "Free models from the OpenCode team",
    keyless: false,
    baseUrl: "https://opencode.ai/inference/v1/chat/completions",
    defaultModel: "cat-jam-free",
    models: OPENCODE_FREE,
    keyLabel: "OpenCode API key",
    keyHelp: "Free models are $0 but the gateway requires a key from opencode.ai/console.",
    keyPlaceholder: "sk-...",
    envKey: "OPENCODE_API_KEY",
    notes: "Models ending in -free are free. Can also be served locally via 'opencode serve'.",
  },
  {
    id: "ollama",
    name: "Ollama (local)",
    tagline: "100% private, runs on your own machine",
    keyless: true,
    baseUrl: "http://localhost:11434/v1/chat/completions",
    defaultModel: "llama3.2",
    models: ["llama3.2", "llama3.1", "qwen2.5", "mistral", "gemma3", "phi4"],
    notes:
      "No key. Must be running on a machine the proxy can reach — replace the URL with your LAN IP (e.g. http://192.168.1.20:11434/v1/chat/completions).",
  },
  {
    id: "lmstudio",
    name: "LM Studio (local)",
    tagline: "Local OpenAI-compatible server",
    keyless: true,
    baseUrl: "http://localhost:1234/v1/chat/completions",
    defaultModel: "local-model",
    models: ["local-model"],
    notes: "Start the local server in LM Studio, load an instruct model, then paste its exact model id below.",
  },
  {
    id: "groq",
    name: "Groq",
    tagline: "Free tier, very fast, great for short rewrites",
    keyless: false,
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "gemma2-9b-it",
      "qwen-2.5-32b",
    ],
    keyLabel: "Groq API key",
    keyHelp: "Free API key from console.groq.com/keys.",
    keyPlaceholder: "gsk_...",
    envKey: "GROQ_API_KEY",
  },
  {
    id: "gemini",
    name: "Google AI Studio",
    tagline: "Gemini free tier",
    keyless: false,
    baseUrl:
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    defaultModel: "gemini-2.5-flash",
    models: ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"],
    keyLabel: "Google AI Studio key",
    keyHelp: "Free key from aistudio.google.com/apikey.",
    keyPlaceholder: "AIza...",
    envKey: "GEMINI_API_KEY",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    tagline: "Any model, many with a :free tier",
    keyless: false,
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    models: [
      "meta-llama/llama-3.3-70b-instruct:free",
      "deepseek/deepseek-chat-v3-0324:free",
      "google/gemini-2.0-flash-exp:free",
      "qwen/qwen-2.5-72b-instruct:free",
    ],
    keyLabel: "OpenRouter API key",
    keyHelp: "Free key from openrouter.ai/keys.",
    keyPlaceholder: "sk-or-...",
    envKey: "OPENROUTER_API_KEY",
  },
  {
    id: "custom",
    name: "Custom endpoint",
    tagline: "Any OpenAI-compatible URL",
    keyless: true,
    baseUrl: "",
    defaultModel: "",
    models: [],
    keyLabel: "API key (optional)",
    keyHelp: "Sent as 'Authorization: Bearer ...' when set.",
    keyPlaceholder: "optional",
  },
];

export const providerById = (id: ProviderId): ProviderDef =>
  PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
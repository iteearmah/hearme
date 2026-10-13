import type { ProviderId } from "./providers";
import type { ToneId } from "./prompt";

export interface AppSettings {
  provider: ProviderId;
  baseUrl: string;
  model: string;
  apiKey: string;
  tone: ToneId;
  softness: number;
  herName: string;
  keepItShort: boolean;
  temperature: number;
  customSystemPrompt: string;
  theme: "system" | "light" | "dark";
  sendKeyWithRequest: boolean;
}

export interface HistoryItem {
  id: string;
  createdAt: number;
  input: string;
  output: string;
  tone: ToneId;
  softness: number;
  provider: string;
  model: string;
  favourite?: boolean;
}

const SETTINGS_KEY = "hearme.settings.v1";
const HISTORY_KEY = "hearme.history.v1";

export const DEFAULT_SETTINGS: AppSettings = {
  provider: "pollinations",
  baseUrl: "",
  model: "",
  apiKey: "",
  tone: "warm",
  softness: 65,
  herName: "",
  keepItShort: false,
  temperature: 0.9,
  customSystemPrompt: "",
  theme: "system",
  sendKeyWithRequest: true,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

export function loadSettings(): AppSettings {
  if (typeof localStorage === "undefined") return DEFAULT_SETTINGS;
  return safeParse(localStorage.getItem(SETTINGS_KEY), DEFAULT_SETTINGS);
}

export function saveSettings(s: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* private mode / quota */
  }
}

export function loadHistory(): HistoryItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as HistoryItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(h: HistoryItem[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 60)));
  } catch {
    /* ignore */
  }
}

export function applyTheme(theme: AppSettings["theme"]) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#141017" : "#fbf7fb");
}
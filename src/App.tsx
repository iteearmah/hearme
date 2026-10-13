import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Composer } from "./components/Composer";
import { History } from "./components/History";
import { Result, type ResultData } from "./components/Result";
import { Settings } from "./components/Settings";
import { Toast } from "./components/ui";
import { ChatError, rewrite } from "./lib/chat";
import { providerById } from "./lib/providers";
import { buildSystemPrompt, buildUserPrompt } from "./lib/prompt";
import {
  applyTheme,
  DEFAULT_SETTINGS,
  loadHistory,
  loadSettings,
  saveHistory,
  saveSettings,
  type AppSettings,
  type HistoryItem,
} from "./lib/storage";

type Tab = "write" | "history" | "settings";

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState<Tab>("write");
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    applyTheme(settings.theme);
    saveSettings(settings);
  }, [settings]);

  const patch = useCallback((p: Partial<AppSettings>) => {
    setSettings((s) => ({ ...s, ...p }));
  }, []);

  const showToast = useCallback((m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1900);
  }, []);

  const providerLabel = useMemo(() => {
    const def = providerById(settings.provider);
    return `${settings.model || def.defaultModel || def.name}`;
  }, [settings.provider, settings.model]);

  const convert = useCallback(async () => {
    const text = draft.trim();
    if (text.length < 3) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const system = settings.customSystemPrompt.trim() || buildSystemPrompt({
      message: text,
      tone: settings.tone,
      softness: settings.softness,
      herName: settings.herName,
      keepItShort: settings.keepItShort,
    });

    try {
      const output = await rewrite(
        { system, user: buildUserPrompt({ message: text } as never) },
        settings,
        controller.signal,
      );
      setResult({
        output,
        input: text,
        tone: settings.tone,
        softness: settings.softness,
        model: providerLabel,
      });
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        input: text,
        output,
        tone: settings.tone,
        softness: settings.softness,
        provider: settings.provider,
        model: providerLabel,
      };
      setHistory((h) => {
        const next = [item, ...h];
        saveHistory(next);
        return next;
      });
    } catch (e) {
      if (controller.signal.aborted) return;
      const msg = e instanceof ChatError ? [e.message, e.hint].filter(Boolean).join(" — ") : "Something went wrong";
      setError(msg);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [draft, providerLabel, settings]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied 👍");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Copied 👍");
    }
  };

  const share = async (value: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text: value });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await copy(value);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "write", label: "Rewrite", icon: "\u2728" },
    { id: "history", label: "History", icon: "\u{1F4C5}" },
    { id: "settings", label: "Provider", icon: "\u2699\uFE0F" },
  ];

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            {"\u{1F48C}"}
          </div>
          <span>HearMe</span>
        </div>
        <span className="pill" title="Active model">
          {providerById(settings.provider).keyless ? "free" : "key"} ·{" "}
          {providerLabel}
        </span>
        <button
          className="icon-btn"
          aria-label="Toggle theme"
          onClick={() =>
            patch({
              theme:
                document.documentElement.dataset.theme === "dark" ? "light" : "dark",
            })
          }
        >
          {document.documentElement.dataset.theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}"}
        </button>
      </header>

      <main>
        {tab === "write" && (
          <>
            <Composer
              draft={draft}
              onDraft={setDraft}
              settings={settings}
              patch={patch}
              onConvert={convert}
              busy={loading}
            />
            <Result
              data={result}
              loading={loading}
              error={error}
              onCopy={() => result && copy(result.output)}
              onShare={() => result && share(result.output)}
              onRegenerate={convert}
            />
          </>
        )}

        {tab === "history" && (
          <History
            items={history}
            onOpen={(item) => {
              setDraft(item.input);
              setResult({
                output: item.output,
                input: item.input,
                tone: item.tone,
                softness: item.softness,
                model: item.model,
              });
              setTab("write");
            }}
            onCopy={(item) => copy(item.output)}
            onDelete={(id) =>
              setHistory((h) => {
                const next = h.filter((x) => x.id !== id);
                saveHistory(next);
                return next;
              })
            }
            onClear={() => {
              if (confirm("Clear all history?")) {
                setHistory([]);
                saveHistory([]);
                showToast("History cleared");
              }
            }}
            onToggleFav={(id) =>
              setHistory((h) => {
                const next = h.map((x) =>
                  x.id === id ? { ...x, favourite: !x.favourite } : x,
                );
                saveHistory(next);
                return next;
              })
            }
          />
        )}

        {tab === "settings" && (
          <Settings
            settings={settings}
            patch={patch}
            onClose={() => setTab("write")}
            onToast={showToast}
          />
        )}
      </main>

      <nav className="tabbar" aria-label="Sections">
        <div className="tabbar-inner">
          {tabs.map((t) => (
            <button
              key={t.id}
              className="tab"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
            >
              <span className="ic" aria-hidden="true">
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <Toast message={toast} />
      <div className="sr-only" aria-live="polite">
        {loading ? "Rewriting your message" : result ? "Rewrite ready" : ""}
      </div>
    </div>
  );
}
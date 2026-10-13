import { useState } from "react";
import { providerById, PROVIDERS, type ProviderId } from "../lib/providers";
import { testConnection } from "../lib/chat";
import type { AppSettings } from "../lib/storage";
import { SwitchRow } from "./ui";
import {
  AutoIcon,
  EraserIcon,
  FreeTagIcon,
  KeyIcon,
  LockIcon,
  MoonIcon,
  SunIcon,
} from "./icons";

export function Settings({
  settings,
  patch,
  onClose,
  onToast,
}: {
  settings: AppSettings;
  patch: (p: Partial<AppSettings>) => void;
  onClose: () => void;
  onToast: (m: string) => void;
}) {
  const def = providerById(settings.provider);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const out = await testConnection(settings);
      setTestResult({ ok: true, msg: `Connected. Model replied: "${out}"` });
    } catch (e) {
      setTestResult({ ok: false, msg: e instanceof Error ? e.message : "Failed" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <section className="card">
        <h2>AI provider</h2>
        <div className="chips">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              className="chip"
              aria-pressed={settings.provider === p.id}
              onClick={() => {
                patch({
                  provider: p.id as ProviderId,
                  baseUrl: p.baseUrl,
                  model: p.defaultModel,
                });
                setTestResult(null);
              }}
            >
              {p.keyless ? <LockIcon size={14} /> : <KeyIcon size={14} />}
              {p.name}
            </button>
          ))}
        </div>
        <p
          style={{
            fontSize: 12.5,
            color: "var(--muted)",
            margin: "10px 0 0",
          }}
        >
          {def.tagline}
          {def.notes ? ` — ${def.notes}` : ""}
        </p>
      </section>

      <section className="card">
        <h2>Connection</h2>

        <div className="field">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            className="input"
            list="model-list"
            value={settings.model}
            placeholder={def.defaultModel || "model id"}
            onChange={(e) => patch({ model: e.target.value })}
          />
          <datalist id="model-list">
            {def.models.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          <div className="chips" style={{ marginTop: 6 }}>
            {def.models.slice(0, 6).map((m) => (
              <button
                key={m}
                className="chip"
                aria-pressed={settings.model === m}
                onClick={() => patch({ model: m })}
              >
                {m.replace(/-free$|:free$/, "")}
                {/-free$|:free$/.test(m) && <FreeTagIcon size={13} />}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="base">Endpoint URL</label>
          <input
            id="base"
            className="input"
            value={settings.baseUrl}
            placeholder={def.baseUrl || "https://host/v1/chat/completions"}
            onChange={(e) => patch({ baseUrl: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="key">{def.keyLabel ?? "API key"}</label>
          <input
            id="key"
            className="input"
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={settings.apiKey}
            placeholder={def.keyPlaceholder ?? "none needed"}
            onChange={(e) => patch({ apiKey: e.target.value })}
          />
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 0" }}>
            {def.keyHelp ??
              "Keyless providers ignore this."}{" "}
            Saved only on this device and sent through the app's server proxy.
          </p>
        </div>

        {!def.keyless && (
          <SwitchRow
            checked={settings.sendKeyWithRequest}
            onChange={(v) => patch({ sendKeyWithRequest: v })}
            label="Attach key to requests"
            sub={
              settings.sendKeyWithRequest
                ? "Sent from your browser to the /api proxy"
                : "Off — the proxy will use its server-side env key only"
            }
          />
        )}

        <div className="field">
          <label htmlFor="temp">Creativity · {settings.temperature.toFixed(1)}</label>
          <input
            id="temp"
            type="range"
            min={0}
            max={1.4}
            step={0.1}
            value={settings.temperature}
            onChange={(e) => patch({ temperature: Number(e.target.value) })}
          />
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" style={{ flex: 1 }} onClick={runTest} disabled={testing}>
            {testing ? "Testing…" : "Test connection"}
          </button>
        </div>
        {testResult && (
          <div
            className="notice"
            style={{
              marginTop: 10,
              background: testResult.ok
                ? "color-mix(in oklab, var(--ok) 12%, transparent)"
                : "color-mix(in oklab, var(--danger) 12%, transparent)",
            }}
          >
            {testResult.msg}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Prompt</h2>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 8px" }}>
          The rewrite prompt is built in. Paste your own below to fully replace
          it — useful if you want a house style.
        </p>
        <textarea
          className="textarea"
          style={{ minHeight: 120 }}
          value={settings.customSystemPrompt}
          placeholder="Leave empty to use the built-in emotional-translation prompt…"
          onChange={(e) => patch({ customSystemPrompt: e.target.value })}
        />
      </section>

      <section className="card">
        <h2>Appearance</h2>
        <div className="chips" style={{ marginTop: 2 }}>
          {(["system", "light", "dark"] as const).map((t) => (
            <button
              key={t}
              className="chip"
              aria-pressed={settings.theme === t}
              onClick={() => patch({ theme: t })}
            >
              {t === "system" ? <AutoIcon size={14} /> : t === "light" ? <SunIcon size={14} /> : <MoonIcon size={14} />}
              {t === "system" ? "Auto" : t === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", margin: "10px 0 0" }}>
          Private by default: no account, no analytics, history stays on device.
        </p>
      </section>

      <div className="row" style={{ marginBottom: 8 }}>
        <button
          className="btn danger"
          style={{ flex: 1 }}
          onClick={() => {
            if (confirm("Clear your key and saved settings?")) {
              patch({ apiKey: "" });
              onToast("API key removed");
            }
          }}
        >
          <EraserIcon size={15} />
          Remove API key
        </button>
        <button className="btn" style={{ flex: 1 }} onClick={onClose}>
          Done
        </button>
      </div>
    </>
  );
}
import { EXAMPLES, TONES, type ToneId } from "../lib/prompt";
import type { AppSettings } from "../lib/storage";
import { SwitchRow } from "./ui";

export function Composer({
  draft,
  onDraft,
  settings,
  patch,
  onConvert,
  busy,
}: {
  draft: string;
  onDraft: (v: string) => void;
  settings: AppSettings;
  patch: (p: Partial<AppSettings>) => void;
  onConvert: () => void;
  busy: boolean;
}) {
  const chars = draft.trim().length;
  return (
    <>
      <section className="card">
        <h2>
          What you actually want to say
          <span style={{ textTransform: "none", letterSpacing: 0 }}>
            {chars} char{chars === 1 ? "" : "s"}
          </span>
        </h2>
        <textarea
          className="textarea"
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          placeholder="Paste the blunt, logical thing you'd normally send…"
          aria-label="Message to rewrite"
          enterKeyHint="enter"
        />
        <div className="chips" style={{ marginTop: 10 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              className="chip"
              onClick={() => onDraft(ex.text)}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>How should it sound?</h2>
        <div className="chips">
          {TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="chip"
              aria-pressed={settings.tone === t.id}
              onClick={() => patch({ tone: t.id as ToneId })}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        <div className="field">
          <label htmlFor="softness">
            Softening · {settings.softness}
          </label>
          <input
            id="softness"
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.softness}
            onChange={(e) => patch({ softness: Number(e.target.value) })}
          />
          <div className="slider-labels">
            <span>Say it like me</span>
            <span>Say it like we care</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="herName">Her name (optional)</label>
          <input
            id="herName"
            className="input"
            value={settings.herName}
            maxLength={40}
            placeholder="Used once, only if it fits"
            onChange={(e) => patch({ herName: e.target.value })}
          />
        </div>

        <SwitchRow
          checked={settings.keepItShort}
          onChange={(v) => patch({ keepItShort: v })}
          label="Keep it short"
          sub="1–3 punchy sentences instead of a paragraph"
        />
      </section>

      <button
        className="btn primary block"
        onClick={onConvert}
        disabled={busy || chars < 3}
      >
        {busy ? "Rewriting…" : "Rewrite it \u2728"}
      </button>
    </>
  );
}
import { useState } from "react";
import { toneById } from "../lib/prompt";

export interface ResultData {
  output: string;
  input: string;
  tone: string;
  softness: number;
  model: string;
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function Result({
  data,
  loading,
  error,
  onCopy,
  onShare,
  onRegenerate,
}: {
  data: ResultData | null;
  loading: boolean;
  error: string | null;
  onCopy: () => void;
  onShare: () => void;
  onRegenerate: () => void;
}) {
  const [showOld, setShowOld] = useState(false);

  if (loading) {
    return (
      <section className="card result">
        <h2>Her version</h2>
        <div className="skeleton" />
        <div className="skeleton" style={{ marginTop: 10, height: 60 }} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="card">
        <h2>Something went wrong</h2>
        <div className="notice error">{error}</div>
        <button className="btn block" style={{ marginTop: 10 }} onClick={onRegenerate}>
          Try again
        </button>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card">
        <h2>Her version</h2>
        <div className="empty">
          <div className="big">{"\u2728"}</div>
          <div>Your rewrite shows up here.</div>
        </div>
      </section>
    );
  }

  const tone = toneById(data.tone as never);

  return (
    <section className="card result">
      <h2>
        Her version
        <button
          className="chip"
          style={{ textTransform: "none", letterSpacing: 0 }}
          onClick={() => setShowOld((v) => !v)}
        >
          {showOld ? "Hide yours" : "Compare"}
        </button>
      </h2>

      {showOld && (
        <p className="diff-old" style={{ marginBottom: 10 }}>
          {data.input}
        </p>
      )}

      <p className="result-body">{data.output}</p>

      <div className="meta">
        <span className="pill">
          {tone.emoji} {tone.label}
        </span>
        <span>softened {data.softness}</span>
        <span>· {data.model}</span>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" style={{ flex: 1 }} onClick={onCopy}>
          Copy
        </button>
        <button className="btn" style={{ flex: 1 }} onClick={onShare}>
          Share
        </button>
        <button className="btn" style={{ flex: 1 }} onClick={onRegenerate}>
          Again
        </button>
      </div>
      <div className="meta">
        Review before sending — keep it honest, it just needs to sound like you.
      </div>
    </section>
  );
}

export { timeAgo };
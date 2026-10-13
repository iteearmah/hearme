import { TONES, toneById } from "../lib/prompt";
import { ClockIcon, EraserIcon, PinIcon, TrashIcon, TONE_ICONS } from "./icons";
import type { HistoryItem } from "../lib/storage";
import { timeAgo } from "./Result";

export function History({
  items,
  onOpen,
  onCopy,
  onDelete,
  onClear,
  onToggleFav,
}: {
  items: HistoryItem[];
  onOpen: (item: HistoryItem) => void;
  onCopy: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onToggleFav: (id: string) => void;
}) {
  if (!items.length) {
    return (
      <section className="card">
        <h2>History</h2>
        <div className="empty">
          <ClockIcon size={38} strokeWidth={1.3} />
          <div>Nothing yet. Your rewrites are saved on this device only.</div>
        </div>
      </section>
    );
  }

  const favourites = items.filter((i) => i.favourite);
  const rest = items.filter((i) => !i.favourite);

  const render = (item: HistoryItem, idx: number) => {
    const tone = toneById(item.tone);
    const ToneIcon = TONE_ICONS[tone.id];
    return (
      <div
        key={item.id}
        className="history-item"
        style={{ animationDelay: `${Math.min(idx, 12) * 22}ms` }}
      >
        <div
          className="hi-top"
          role="button"
          tabIndex={0}
          onClick={() => onOpen(item)}
          onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
        >
          <span>
            <ToneIcon size={12} />
            {tone.label} · {timeAgo(item.createdAt)}
          </span>
          <span
            role="button"
            tabIndex={0}
            aria-label={item.favourite ? "Unpin" : "Pin"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(item.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                onToggleFav(item.id);
              }
            }}
          >
            <PinIcon size={15} filled={item.favourite} />
          </span>
        </div>
        <div
          className="hi-text"
          role="button"
          tabIndex={0}
          onClick={() => onOpen(item)}
          onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
        >
          {item.output}
        </div>
        <div className="row" style={{ marginTop: 9 }}>
          <button
            className="chip"
            onClick={() => onCopy(item)}
            aria-label="Copy this rewrite"
          >
            Copy
          </button>
          <button
            className="chip"
            onClick={() => onOpen(item)}
            aria-label="Reuse this message"
          >
            Reuse
          </button>
          <button
            className="chip"
            onClick={() => onDelete(item.id)}
            aria-label="Delete this rewrite"
          >
            <TrashIcon size={14} />
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {favourites.length > 0 && (
        <section className="card">
          <h2>Pinned</h2>
          {favourites.map(render)}
        </section>
      )}
      <section className="card">
        <h2>
          Recent
          <button className="chip" onClick={onClear}>
            <EraserIcon size={14} />
            Clear all
          </button>
        </h2>
        {rest.length ? rest.map(render) : (
          <div className="empty">Nothing unpinned yet.</div>
        )}
      </section>
      <p
        style={{
          fontSize: 12,
          color: "var(--muted)",
          textAlign: "center",
          margin: 0,
        }}
      >
        Stored locally in this browser. {TONES.length} tones available.
      </p>
    </>
  );
}
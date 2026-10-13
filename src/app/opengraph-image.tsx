import { ImageResponse } from "next/og";

export const alt =
  "HearMe — rewrite blunt messages so she'll actually want to hear them";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #fbf7fb 0%, #f6e3f0 55%, #ece4fb 100%)",
          color: "#221b26",
          fontFamily: "sans-serif",
        }}
      >
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              background: "linear-gradient(135deg, #d1467f, #8b5cf6)",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            H
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            HearMe
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -2.5,
              maxWidth: 940,
            }}
          >
            Say what you mean. In a way she&apos;ll actually hear.
          </div>
          <div style={{ fontSize: 33, color: "#5d5266", maxWidth: 900 }}>
            Rewrite blunt, logical messages into warm ones — keeping your point,
            leading with feeling.
          </div>
        </div>

        {/* footer chips */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {["Installable PWA", "No account", "No API key needed", "Free AI providers"].map(
            (label) => (
              <div
                key={label}
                style={{
                  fontSize: 24,
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.78)",
                  border: "1px solid #e7d9ee",
                  color: "#4a3f52",
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
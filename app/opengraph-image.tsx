import { ImageResponse } from "next/og";
import { site } from "@/lib/seo/site";

export const runtime = "edge";
export const alt = `${site.name}. ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Brand social card: warm paper, a small day band, and the promise. */
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
          background: "#f7f5ef",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600, color: "#211f1b" }}>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#211f1b",
              maxWidth: 900,
            }}
          >
            Stop losing Claude hours while you sleep
          </div>
          {/* A small day band echoing the product's signature timeline. */}
          <div
            style={{
              display: "flex",
              width: 720,
              height: 40,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #e5e1d6",
            }}
          >
            <div style={{ width: "33%", background: "#eae6da" }} />
            <div style={{ width: "17%", background: "#d98c6f" }} />
            <div style={{ width: "50%", background: "#c15f3c" }} />
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#6b675f" }}>{site.tagline}</div>
      </div>
    ),
    { ...size },
  );
}

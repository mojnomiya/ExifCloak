import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "ExifCloak — Image Metadata Editor for macOS";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#161618",
          color: "#ededf0",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              backgroundColor: "#ededf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
              color: "#161618",
              marginRight: "20px",
            }}
          >
            EC
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>ExifCloak</div>
          <div
            style={{
              marginLeft: "20px",
              fontSize: "18px",
              color: "#9898a3",
              border: "1px solid #2e2e33",
              borderRadius: "999px",
              padding: "6px 16px",
            }}
          >
            Free · Open Source
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "68px",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          <div>See what your photos reveal.</div>
          <div>Then decide what stays.</div>
        </div>

        <div style={{ fontSize: "28px", color: "#9898a3", marginBottom: "40px" }}>
          View, strip, edit &amp; regenerate EXIF · GPS · C2PA metadata. 100% offline.
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {["EXIF", "GPS", "IPTC", "XMP", "C2PA", "macOS + Web"].map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: "20px",
                color: "#ededf0",
                backgroundColor: "#1e1e21",
                border: "1px solid #2e2e33",
                borderRadius: "8px",
                padding: "8px 18px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

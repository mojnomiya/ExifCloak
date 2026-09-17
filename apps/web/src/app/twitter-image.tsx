import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "ExifCloak — Image Metadata Editor for macOS";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
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
          <div>Strip EXIF, GPS and AI markers.</div>
          <div>100% offline.</div>
        </div>

        <div style={{ fontSize: "28px", color: "#9898a3" }}>
          Free open-source metadata editor for macOS + web.
        </div>
      </div>
    ),
    { ...size }
  );
}

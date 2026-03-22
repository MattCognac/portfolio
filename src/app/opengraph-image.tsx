import { ImageResponse } from "next/og";

export const alt = "Matt Hennessy — Designer, Developer, Photographer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#fafafa",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            MH
          </div>
          <span
            style={{
              fontSize: "24px",
              color: "#a3a3a3",
              fontWeight: 400,
            }}
          >
            mattcognac.com
          </span>
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-2px",
            marginBottom: "24px",
          }}
        >
          Matt Hennessy
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          Designer · Developer · Adventure Photographer
        </div>
      </div>
    ),
    { ...size },
  );
}

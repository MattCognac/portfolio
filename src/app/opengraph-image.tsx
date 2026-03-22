import { ImageResponse } from "next/og";

export const alt = "Matt Hennessy — Designer, Developer, Photographer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mattcognac.com";
const previewImageUrl = new URL(
  "/assets/opengraph/homepage-preview.png",
  siteUrl,
).toString();

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <img
          src={previewImageUrl}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Persona AI - Schwäbisch Media";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          gap: 32,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path d="M22.3679 5.3335L28.6386 8.88906L22.3679 12.4446L16.0972 8.88906L22.3679 5.3335Z" fill="#F39100" />
          <path d="M22.3679 12.4443L28.6386 15.9999L22.3679 19.5554L16.0972 15.9999L22.3679 12.4443Z" fill="#C00216" />
          <path d="M22.3679 19.5557L28.6386 23.1112L22.3679 26.6668L16.0972 23.1112L22.3679 19.5557Z" fill="#FBB900" />
          <path d="M9.82627 5.3335L16.097 8.88906L9.82627 12.4446L3.55556 8.88906L9.82627 5.3335Z" fill="#FBB900" />
          <path d="M16.0971 1.77783L22.3678 5.33339L16.0971 8.88895L9.82639 5.33339L16.0971 1.77783Z" fill="#FFCF00" />
          <path d="M9.82627 12.4443L16.097 15.9999L9.82627 19.5554L3.55556 15.9999L9.82627 12.4443Z" fill="#9B0332" />
          <path d="M16.0971 15.9998L9.82639 12.4442L16.0971 8.88867V15.9998Z" fill="#CB060B" />
          <path d="M28.6388 23.1111L22.3681 19.5556L28.6388 16V23.1111Z" fill="#FFCF00" />
          <path d="M28.6388 15.9998L22.3681 12.4442L28.6388 8.88867V15.9998Z" fill="#E7410E" />
          <path d="M28.6388 8.88895L22.3681 5.33339L28.6388 1.77783V8.88895Z" fill="#FBB900" />
          <path d="M3.55556 23.1111L9.82627 19.5556L3.55556 16V23.1111Z" fill="#E7410E" />
          <path d="M3.55556 15.9998L9.82627 12.4442L3.55556 8.88867V15.9998Z" fill="#E6262F" />
          <path d="M3.55556 8.88895L9.82627 5.33339L3.55556 1.77783V8.88895Z" fill="#FFDE0C" />
          <path d="M16.0972 15.9998L22.3679 12.4442L16.0972 8.88867V15.9998Z" fill="#A71321" />
          <path d="M16.0971 23.1111L9.82639 19.5556L16.0971 16V23.1111Z" fill="#7E0C3E" />
          <path d="M16.0972 23.1111L22.3679 19.5556L16.0972 16V23.1111Z" fill="#5F0021" />
          <path d="M9.82627 19.5557L16.097 23.1112L9.82627 26.6668L3.55556 23.1112L9.82627 19.5557Z" fill="#F39100" />
          <path d="M16.0971 23.1113L22.3678 26.6669L16.0971 30.2224L9.82639 26.6669L16.0971 23.1113Z" fill="#FFCF00" />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Persona AI
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#a1a1aa",
            }}
          >
            Schwäbisch Media
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MyLink - 개발자를 위한 통합 링크 프로필";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background Glows */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "600px",
            height: "600px",
            background: "rgba(79, 70, 229, 0.15)",
            filter: "blur(100px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "500px",
            height: "500px",
            background: "rgba(139, 92, 246, 0.1)",
            filter: "blur(80px)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              background: "rgba(79, 70, 229, 0.1)",
              border: "1px solid rgba(79, 70, 229, 0.3)",
              borderRadius: "100px",
              fontSize: "24px",
              fontWeight: 600,
              color: "#818cf8",
            }}
          >
            MyLink v1.0
          </div>
          <h1
            style={{
              fontSize: "120px",
              fontWeight: 900,
              background: "linear-gradient(to bottom right, #ffffff, #71717a)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              letterSpacing: "-0.05em",
            }}
          >
            마이링크
          </h1>
          <p
            style={{
              fontSize: "42px",
              color: "#a1a1aa",
              fontWeight: 500,
              margin: 0,
            }}
          >
            나만의 링크 페이지를 30분 만에
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#3f3f46",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
          }}
        >
          Powered by MyLink
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

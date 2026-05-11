import { ImageResponse } from "next/og";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export const runtime = "nodejs"; // Firestore SDK와 호환성을 위해 nodejs 런타임 사용

export const alt = "MyLink Profile";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.username);

  // 1. 유저 정보 조회 (기존 페이지 로직과 동일하게 검색)
  let userData = null;
  try {
    const q = query(collection(db, "users"), where("username", "==", decodedName), limit(1));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      userData = snap.docs[0].data();
    } else {
      // username으로 없으면 displayName으로도 검색 시도
      const q2 = query(collection(db, "users"), where("displayName", "==", decodedName), limit(1));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        userData = snap2.docs[0].data();
      }
    }
  } catch (e) {
    console.error("OG Data Fetch Error:", e);
  }

  const name = userData?.displayName || decodedName;
  const username = userData?.username || decodedName;
  const description = userData?.description || "마이링크 프로필 페이지입니다.";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background Glows */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "700px",
            height: "700px",
            background: "rgba(99, 102, 241, 0.15)",
            filter: "blur(120px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-5%",
            width: "400px",
            height: "400px",
            background: "rgba(168, 85, 247, 0.1)",
            filter: "blur(100px)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 10,
            maxWidth: "800px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#6366f1",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              M
            </div>
            <span style={{ color: "#6366f1", fontSize: "24px", fontWeight: "bold", letterSpacing: "2px" }}>MYLINK</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1
              style={{
                fontSize: "90px",
                fontWeight: 900,
                color: "white",
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              {name}
            </h1>
            <p
              style={{
                fontSize: "32px",
                color: "#6366f1",
                fontWeight: 600,
                margin: "12px 0 0 0",
              }}
            >
              @{username}
            </p>
          </div>

          <p
            style={{
              fontSize: "36px",
              color: "#a1a1aa",
              lineHeight: 1.4,
              margin: "20px 0 0 0",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>

        {/* Decorative Element */}
        <div
          style={{
            position: "absolute",
            right: "80px",
            bottom: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#3f3f46",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          <span>mylink.com/{username}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

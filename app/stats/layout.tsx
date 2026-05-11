import { Metadata } from "next";

export const metadata: Metadata = {
  title: "클릭 통계",
  description: "내 링크의 방문자 통계와 클릭 현황을 한눈에 확인하세요.",
  openGraph: {
    title: "클릭 통계 | MyLink",
    description: "내 링크의 방문자 통계와 클릭 현황을 한눈에 확인하세요.",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

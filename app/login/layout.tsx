import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "MyLink에 로그인하여 당신만의 멋진 링크 페이지를 완성해 보세요.",
  openGraph: {
    title: "로그인 | MyLink",
    description: "MyLink에 로그인하여 당신만의 멋진 링크 페이지를 완성해 보세요.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/query-provider"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MyLink - 개발자를 위한 통합 링크 프로필",
    template: "%s | MyLink",
  },
  description: "흩어져 있는 당신의 소셜 링크를 한곳에 모아 공유하세요. 30분 만에 만드는 나만의 프로필 페이지.",
  keywords: ["개발자 링크", "프로필 링크", "멀티링크", "MyLink", "소셜 링크", "포트폴리오", "개인 브랜딩"],
  authors: [{ name: "MyLink Team" }],
  openGraph: {
    title: "MyLink - 개발자를 위한 통합 링크 프로필",
    description: "흩어져 있는 당신의 소셜 링크를 한곳에 모아 공유하세요. 30분 만에 만드는 나만의 프로필 페이지.",
    url: siteUrl,
    siteName: "MyLink",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MyLink - 개발자를 위한 통합 링크 프로필",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 개발자를 위한 통합 링크 프로필",
    description: "흩어져 있는 당신의 소셜 링크를 한곳에 모아 공유하세요.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <AuthProvider>
          <QueryProvider>
            <Header />
            <ThemeProvider>{children}</ThemeProvider>
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

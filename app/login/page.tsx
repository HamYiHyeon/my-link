"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GoogleIcon } from "@hugeicons/core-free-icons";

export default function LoginPage() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  // 이미 로그인된 경우 홈(대시보드)으로 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-6 text-center text-zinc-100">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20">
        <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 animate-fade-in-up">
        <div className="space-y-4">
          <h1 className="bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-5xl font-black tracking-tight text-transparent">
            MyLink 로그인
          </h1>
          <p className="text-lg text-zinc-400">
            당신만의 멋진 링크 페이지를 완성해 보세요.
          </p>
        </div>
        
        <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-2xl shadow-2xl">
          <h2 className="mb-6 text-xl font-bold">환영합니다!</h2>
          <p className="mb-8 text-sm text-zinc-400 leading-relaxed">
            구글 계정으로 간편하게 시작하고<br />
            당신의 모든 소셜 링크를 한곳에서 관리하세요.
          </p>
          <Button 
            size="lg" 
            onClick={loginWithGoogle}
            className="group relative w-full h-14 overflow-hidden rounded-2xl bg-white text-zinc-950 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-3">
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 로그인하기
            </div>
          </Button>
        </div>
        
        <footer className="text-sm text-zinc-600 font-medium tracking-widest uppercase">
          Powered by MyLink
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function Header() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-white">MyLink</h1>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = `${window.location.origin}/${user.uid}`;
                navigator.clipboard.writeText(url);
                alert("링크가 복사되었습니다!");
              }}
              className="hidden sm:flex items-center gap-2 border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <span className="text-xs">내 링크 복사</span>
            </Button>
            <span className="text-sm font-medium text-zinc-300">
              {user.email ? user.email.split('@')[0] : "사용자"}님
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <HugeiconsIcon icon={Logout01Icon} className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={loginWithGoogle}
            className="flex items-center gap-2 border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white"
          >
            {/* Google Icon Placeholder or SVG */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google로 로그인</span>
          </Button>
        )}
      </div>
    </header>
  );
}

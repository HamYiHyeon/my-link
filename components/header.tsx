"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { 
  Logout01Icon, 
  LinkSquare02Icon, 
  ViewIcon, 
  Settings02Icon, 
  Moon02Icon,
  Sun03Icon,
  ChartHistogramIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function Header() {
  const { user, loginWithGoogle, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Firestore에서 프로필 데이터 조회 (displayName 기반 URL 생성용)
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) return snap.data() as { displayName: string; username: string };
      return null;
    },
    enabled: !!user,
  });

  const publicUrl = profile?.displayName
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${encodeURIComponent(profile.displayName)}`
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Link href="/">
          <h1 className="text-xl font-bold tracking-tight text-white cursor-pointer hover:opacity-80 transition-opacity">MyLink</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-zinc-400 hover:text-white">
              <HugeiconsIcon icon={ViewIcon} className="mr-2 h-4 w-4" />
              내 페이지 관리
            </Button>
          </Link>
        )}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:bg-zinc-800 outline-none flex items-center justify-center">
              <Avatar className="h-10 w-10 border border-zinc-800 transition-opacity hover:opacity-80">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                <AvatarFallback className="bg-zinc-800 text-zinc-300 font-semibold">
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-100" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user.email ? user.email.split('@')[0] : "사용자"}
                    </p>
                    <p className="text-xs leading-none text-zinc-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-zinc-800 focus:text-white" 
                  onClick={() => {
                    if (publicUrl) {
                      navigator.clipboard.writeText(publicUrl);
                      toast.success("링크가 복사되었습니다!");
                    }
                  }}
                  disabled={!publicUrl}
                >
                  <HugeiconsIcon icon={LinkSquare02Icon} className="mr-2 h-4 w-4" />
                  <span>내 링크 복사하기</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-zinc-800 focus:text-white" 
                  onClick={() => {
                    if (profile?.displayName) {
                      window.open(`/${encodeURIComponent(profile.displayName)}`, '_blank');
                    }
                  }}
                  disabled={!profile?.displayName}
                >
                  <HugeiconsIcon icon={ViewIcon} className="mr-2 h-4 w-4" />
                  <span>퍼블릭 뷰로 보기</span>
                </DropdownMenuItem>
                <Link href="/stats">
                  <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                    <HugeiconsIcon icon={ChartHistogramIcon} className="mr-2 h-4 w-4" />
                    <span>클릭 통계</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                  <HugeiconsIcon icon={Settings02Icon} className="mr-2 h-4 w-4" />
                  <span>프로필 설정</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-zinc-800 focus:text-white"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <HugeiconsIcon icon={theme === "dark" ? Sun03Icon : Moon02Icon} className="mr-2 h-4 w-4" />
                  <span>{theme === "dark" ? "라이트 모드" : "다크 모드"}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400" 
                onClick={logout}
              >
                <HugeiconsIcon icon={Logout01Icon} className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InstagramIcon,
  YoutubeIcon,
  Book02Icon,
  GlobalIcon,
  UserIcon,
  ChartHistogramIcon,
  LinkSquare02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

// Icon mapping function
const getIconRenderer = (iconName?: string) => {
  switch (iconName) {
    case "instagram": return <HugeiconsIcon icon={InstagramIcon} className="w-5 h-5" />;
    case "youtube": return <HugeiconsIcon icon={YoutubeIcon} className="w-5 h-5" />;
    case "book": return <HugeiconsIcon icon={Book02Icon} className="w-5 h-5" />;
    case "github": return <HugeiconsIcon icon={GlobalIcon} className="w-5 h-5" />;
    case "user": return <HugeiconsIcon icon={UserIcon} className="w-5 h-5" />;
    default: return <HugeiconsIcon icon={UserIcon} className="w-5 h-5" />;
  }
};

interface LinkWithStats {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clickCount: number;
}

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // 비로그인 시 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // 링크별 클릭수 조회 (clickCount 내림차순 정렬)
  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ["stats-links", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const linksRef = collection(db, "users", user.uid, "links");
      const q = query(linksRef, orderBy("clickCount", "desc"));
      const snap = await getDocs(q);

      return snap.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        url: doc.data().url,
        icon: doc.data().icon,
        clickCount: doc.data().clickCount || 0,
      })) as LinkWithStats[];
    },
    enabled: !!user,
  });

  // 총 클릭수 합산
  const totalClicks = links?.reduce((sum, link) => sum + link.clickCount, 0) ?? 0;

  // 로딩 상태
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // 최대 클릭수 (진행 바 비율 계산용)
  const maxClicks = links?.length ? Math.max(...links.map((l) => l.clickCount), 1) : 1;

  return (
    <div className="flex min-h-svh justify-center bg-zinc-950 px-6 py-24 text-zinc-100">
      {/* 배경 효과 — 보라색 계열 (#5B5FC7) */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-25">
        <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-[#5B5FC7]/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[#7B5FC7]/30 blur-[100px]" />
        <div className="absolute top-[30%] left-[-15%] h-[300px] w-[300px] rounded-full bg-[#5B5FC7]/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 animate-fade-in-up">
        {/* 페이지 타이틀 */}
        <div className="mb-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5B5FC7]/15 ring-1 ring-[#5B5FC7]/40 shadow-lg shadow-[#5B5FC7]/10">
            <HugeiconsIcon icon={ChartHistogramIcon} className="h-7 w-7 text-[#8B8FE7]" />
          </div>
          <h1 className="mb-2 bg-gradient-to-br from-white via-[#C8CAFF] to-[#5B5FC7] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
            클릭 통계
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            내 링크의 클릭 현황을 확인하세요
          </p>
        </div>

        {/* 상단: 총 클릭수 카드 — 글래스모피즘 */}
        <Card className="relative overflow-hidden border border-[#5B5FC7]/25 bg-gradient-to-br from-[#5B5FC7]/10 to-zinc-900/50 backdrop-blur-xl shadow-xl shadow-[#5B5FC7]/10 ring-1 ring-white/5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B8FE7]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
          <CardContent className="relative flex items-center gap-5 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5B5FC7]/20 ring-1 ring-[#5B5FC7]/40 shadow-inner">
              <HugeiconsIcon icon={LinkSquare02Icon} className="h-7 w-7 text-[#8B8FE7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-400 tracking-wide">총 클릭수</span>
              <div className="flex items-baseline gap-1.5">
                {linksLoading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-zinc-800 mt-1" />
                ) : (
                  <>
                    <span className="text-4xl font-black text-white tabular-nums">
                      {totalClicks.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">회</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단: 링크별 클릭수 순위 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5 text-[#8B8FE7]/60" />
            <h2 className="text-sm font-semibold text-zinc-400 tracking-wide">링크별 클릭수 순위</h2>
          </div>

          {linksLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#5B5FC7] border-t-transparent" />
            </div>
          ) : links?.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <p>아직 등록된 링크가 없습니다.</p>
              <p className="text-sm mt-2">링크를 추가하고 공유해보세요!</p>
            </div>
          ) : (
            links?.map((link, index) => {
              const ratio = maxClicks > 0 ? (link.clickCount / maxClicks) * 100 : 0;

              return (
                <Card
                  key={link.id}
                  className="relative overflow-hidden border border-zinc-800/40 bg-zinc-900/30 backdrop-blur-xl ring-1 ring-white/[0.04] transition-all duration-300 ease-out hover:border-[#5B5FC7]/30 hover:bg-zinc-800/40 hover:shadow-lg hover:shadow-[#5B5FC7]/5 group"
                >
                  {/* 상단 글로우 라인 */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {/* 글래스 반사 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                  <CardContent className="relative flex flex-col gap-3 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 순위 뱃지 */}
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                          index === 0
                            ? "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30"
                            : index === 1
                              ? "bg-zinc-400/10 text-zinc-300 ring-1 ring-zinc-400/20"
                              : index === 2
                                ? "bg-amber-700/15 text-amber-600 ring-1 ring-amber-700/30"
                                : "bg-zinc-800/60 text-zinc-500 ring-1 ring-zinc-700/30"
                        }`}>
                          {index + 1}
                        </div>
                        {/* 아이콘 */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300 shadow-inner ring-1 ring-white/5 transition-colors duration-300 group-hover:bg-[#5B5FC7]/10 group-hover:text-[#8B8FE7] group-hover:ring-[#5B5FC7]/30">
                          {getIconRenderer(link.icon)}
                        </div>
                        {/* 타이틀 */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-zinc-200 truncate">
                            {link.title}
                          </span>
                          <span className="text-xs text-zinc-500 truncate max-w-[160px]">
                            {link.url}
                          </span>
                        </div>
                      </div>
                      {/* 클릭수 */}
                      <div className="flex items-baseline gap-1 shrink-0 ml-3">
                        <span className="text-lg font-bold text-white tabular-nums">
                          {link.clickCount.toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-500">회</span>
                      </div>
                    </div>

                    {/* 진행 바 (최대 클릭수 대비 비율) */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800/60">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#5B5FC7] to-[#8B8FE7] transition-all duration-700 ease-out"
                        style={{ width: `${ratio}%` }}
                      />
                      {/* 진행 바 글로우 */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#5B5FC7]/50 to-[#8B8FE7]/50 blur-sm transition-all duration-700 ease-out"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <footer className="mt-12 text-center">
          <p className="text-zinc-600 text-xs font-medium tracking-widest uppercase">
            Powered by MyLink
          </p>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { LinkItem } from "@/data/links";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  where,
  getDocs
} from "firebase/firestore";
import { LinkItemCard } from "@/components/link-item-card";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  PencilEdit02Icon, 
  Link01Icon, 
  ChartBarLineIcon, 
  UserIcon,
  ArrowRight02Icon 
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const determineIcon = (url: string, title: string) => {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  if (lowerUrl.includes("instagram.com") || lowerTitle.includes("인스타그램") || lowerTitle.includes("instagram")) return "instagram";
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be") || lowerTitle.includes("유튜브") || lowerTitle.includes("youtube")) return "youtube";
  if (lowerUrl.includes("github.com") || lowerTitle.includes("깃허브") || lowerTitle.includes("github")) return "github";
  if (lowerUrl.includes("velog.io") || lowerUrl.includes("tistory.com") || lowerUrl.includes("brunch.co.kr") || lowerTitle.includes("블로그") || lowerTitle.includes("blog")) return "book";
  
  return "user";
};

export default function Page() {
  const { user, loginWithGoogle, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [links, setLinks] = useState<LinkItem[]>([]);
  
  // Profile 편집용 로컬 상태
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // 1. 프로필 조회 Query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const profileRef = doc(db, "users", user.uid);
      const snap = await getDoc(profileRef);
      
      const emailPrefix = user.email ? user.email.split('@')[0] : "이름 없음";
      const fallbackName = user.displayName || "이름 없음";

      if (snap.exists()) {
        const data = snap.data();
        return {
          username: data.username || emailPrefix,
          displayName: data.displayName || fallbackName,
          description: data.description || "소개글을 입력해주세요.",
        };
      } else {
        const defaultProfile = {
          username: emailPrefix,
          displayName: fallbackName,
          description: "소개글을 입력해주세요.",
          email: user.email,
          createdAt: serverTimestamp(),
        };
        await setDoc(profileRef, defaultProfile);
        return {
          username: defaultProfile.username,
          displayName: defaultProfile.displayName,
          description: defaultProfile.description,
        };
      }
    },
    enabled: !!user,
  });

  // 초기 편집 값 설정
  useEffect(() => {
    if (profile && !isEditingProfile) {
      setEditUsername(profile.username);
      setEditName(profile.displayName);
      setEditDesc(profile.description);
    }
  }, [profile, isEditingProfile]);

  // 2. 링크 실시간 구독
  useEffect(() => {
    if (!user) {
      setLinks([]);
      return;
    }

    const linksRef = collection(db, "users", user.uid, "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        url: doc.data().url,
        icon: doc.data().icon,
      })) as LinkItem[];
      setLinks(fetchedLinks);
    }, (error) => {
      console.error("Firestore fetching error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. 링크 추가 Mutation
  const addLinkMutation = useMutation({
    mutationFn: async (newLink: Omit<LinkItem, "id">) => {
      if (!user) throw new Error("Not authenticated");
      const linkToAdd = {
        ...newLink,
        icon: determineIcon(newLink.url, newLink.title), 
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const linksRef = collection(db, "users", user.uid, "links");
      return await addDoc(linksRef, linkToAdd);
    },
    onSuccess: () => {
      toast.success("링크가 성공적으로 추가되었습니다.");
    },
    onError: (error) => {
      console.error("Error adding link: ", error);
      toast.error("링크를 추가하는 중 오류가 발생했습니다.");
    },
  });

  // 4. 프로필 업데이트 Mutation (낙관적 업데이트 적용)
  const updateProfileMutation = useMutation({
    mutationFn: async (newProfile: { username: string; displayName: string; description: string }) => {
      if (!user || !profile) throw new Error("Not authenticated");

      // 중복 체크
      if (newProfile.username !== profile.username) {
        const q = query(collection(db, "users"), where("username", "==", newProfile.username));
        const snap = await getDocs(q);
        let available = true;
        snap.forEach((d) => {
          if (d.id !== user.uid) available = false;
        });
        if (!available) {
          throw new Error("ALREADY_TAKEN");
        }
      }

      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, {
        username: newProfile.username,
        displayName: newProfile.displayName,
        description: newProfile.description,
        updatedAt: serverTimestamp(),
      });
    },
    onMutate: async (newProfile) => {
      // 나가는 리페칭 취소
      await queryClient.cancelQueries({ queryKey: ["profile", user?.uid] });

      // 이전 값 스냅샷
      const previousProfile = queryClient.getQueryData(["profile", user?.uid]);

      // 낙관적으로 캐시 업데이트
      queryClient.setQueryData(["profile", user?.uid], newProfile);

      return { previousProfile };
    },
    onError: (error: any, __, context) => {
      // 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile", user?.uid], context.previousProfile);
      }
      
      if (error.message === "ALREADY_TAKEN") {
        toast.error("이미 사용 중인 아이디입니다. 다른 아이디를 선택해주세요.");
      } else {
        console.error("Error updating profile:", error);
        toast.error("프로필 수정 중 오류가 발생했습니다.");
      }
    },
    onSettled: () => {
      // 무조건 최신 데이터 동기화
      queryClient.invalidateQueries({ queryKey: ["profile", user?.uid] });
      setIsEditingProfile(false);
    },
    onSuccess: () => {
      toast.success("프로필이 저장되었습니다.");
    }
  });

  const handleCheckUsername = async () => {
    if (!editUsername.trim() || !user) return;
    setIsCheckingUsername(true);
    setUsernameAvailable(null);
    try {
      const q = query(collection(db, "users"), where("username", "==", editUsername.trim()));
      const snap = await getDocs(q);
      let available = true;
      snap.forEach((d) => {
        if (d.id !== user.uid) {
          available = false;
        }
      });
      setUsernameAvailable(available);
      if (available) {
        toast.success("사용 가능한 아이디입니다.");
      } else {
        toast.error("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("아이디 중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-100 selection:bg-indigo-500/30">
        {/* Background Glow */}
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-25">
          <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        </div>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-20 py-20 animate-fade-in">
          {/* Hero Section */}
          <div className="flex flex-col items-center gap-6 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              v1.0 정식 출시
            </div>
            <h1 className="bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-6xl md:text-8xl font-black tracking-tight text-transparent leading-[1.1]">
              마이링크
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed">
              나만의 링크 페이지를 <span className="text-white font-bold underline decoration-indigo-500 decoration-2 underline-offset-4">30분 만에</span>
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="group h-16 px-10 rounded-2xl bg-indigo-600 text-lg font-bold transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                >
                  시작하기
                  <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "링크 관리", 
                desc: "다양한 소셜 링크와 프로필을 실시간으로 손쉽게 관리하세요.", 
                icon: Link01Icon,
                color: "indigo"
              },
              { 
                title: "클릭 통계", 
                desc: "어떤 링크가 가장 인기가 많은지 방문자 통계를 한눈에 확인하세요.", 
                icon: ChartBarLineIcon,
                color: "violet"
              },
              { 
                title: "개인 URL", 
                desc: "기억하기 쉬운 나만의 고유한 URL로 정체성을 표현해 보세요.", 
                icon: UserIcon,
                color: "fuchsia"
              },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group relative flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 transition-all hover:border-zinc-700/50 hover:bg-zinc-800/40 hover:shadow-2xl"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400 transition-all group-hover:bg-${feature.color}-500/20 group-hover:text-${feature.color}-400 group-hover:scale-110`}>
                  <HugeiconsIcon icon={feature.icon} size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
          
          <footer className="mt-10 flex flex-col items-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <p className="text-xs font-bold tracking-[0.3em] text-zinc-600 uppercase">
              Powered by MyLink
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh justify-center bg-zinc-950 px-6 py-24 text-zinc-100 selection:bg-zinc-800">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20">
        <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 animate-fade-in-up">
        {/* Profile Section */}
        <div className="mb-8 text-center">
          <div className="group relative inline-block">
            {isEditingProfile ? (
              <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-900/50 rounded-lg border border-zinc-800 focus-within:border-indigo-500/50 px-3 flex items-center">
                    <span className="text-zinc-500 text-sm">mylink.com/</span>
                    <input
                      value={editUsername}
                      onChange={(e) => {
                        setEditUsername(e.target.value);
                        setUsernameAvailable(null);
                      }}
                      className="bg-transparent text-white text-sm outline-none py-2 w-full ml-1"
                      placeholder="username"
                    />
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleCheckUsername}
                    disabled={isCheckingUsername || (profile && editUsername === profile.username) || editUsername.trim() === ""}
                  >
                    {isCheckingUsername ? "확인 중..." : "중복 확인"}
                  </Button>
                </div>
                {usernameAvailable === false && <p className="text-red-400 text-xs text-left ml-2">이미 사용 중인 아이디입니다.</p>}
                {usernameAvailable === true && <p className="text-green-400 text-xs text-left ml-2">사용 가능한 아이디입니다.</p>}
                
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-transparent text-center text-3xl font-extrabold tracking-tight text-white outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg px-2 py-1 mt-2"
                  placeholder="이름"
                  autoFocus
                />
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="bg-transparent text-center text-zinc-400 font-medium tracking-wide text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg px-2 py-1"
                  placeholder="소개글"
                />
                <div className="mt-2 flex justify-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => {
                    setIsEditingProfile(false);
                    if (profile) {
                      setEditUsername(profile.username);
                      setEditName(profile.displayName);
                      setEditDesc(profile.description);
                    }
                    setUsernameAvailable(null);
                  }}>취소</Button>
                  <Button 
                    size="sm" 
                    className="bg-indigo-600 hover:bg-indigo-500" 
                    onClick={() => updateProfileMutation.mutate({
                      username: editUsername.trim(),
                      displayName: editName,
                      description: editDesc,
                    })}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mb-2 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
                  {profile?.displayName}
                </h1>
                <p className="text-zinc-500 text-sm font-medium tracking-widest mt-1 mb-3">
                  @{profile?.username}
                </p>
                <p className="text-zinc-400 font-medium tracking-wide text-sm">
                  {profile?.description}
                </p>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute -right-8 top-0 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="mb-2">
            <AddLinkDialog onAdd={(newLink) => addLinkMutation.mutate(newLink)} />
          </div>

          {links.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <p>아직 등록된 링크가 없습니다.</p>
              <p className="text-sm mt-2">상단의 버튼을 눌러 링크를 추가해보세요!</p>
            </div>
          ) : (
            links.map((link) => (
              <LinkItemCard key={link.id} link={link} />
            ))
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

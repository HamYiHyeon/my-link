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
  updateDoc 
} from "firebase/firestore";
import { LinkItemCard } from "@/components/link-item-card";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PencilEdit02Icon, CheckReadOnlyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
  const { user, loginWithGoogle, loading } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profile, setProfile] = useState({ displayName: "", description: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    if (!user) {
      setLinks([]);
      setProfile({ displayName: "", description: "" });
      return;
    }

    // Load Profile
    const profileRef = doc(db, "users", user.uid);
    const fetchProfile = async () => {
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const data = snap.data();
        const emailPrefix = user.email ? user.email.split('@')[0] : "이름 없음";
        setProfile({
          displayName: data.displayName || emailPrefix,
          description: data.description || "소개글을 입력해주세요.",
        });
        setEditName(data.displayName || emailPrefix);
        setEditDesc(data.description || "");
      } else {
        // Create default profile
        const emailPrefix = user.email ? user.email.split('@')[0] : "이름 없음";
        const defaultProfile = {
          displayName: emailPrefix,
          description: "소개글을 입력해주세요.",
          email: user.email,
          createdAt: serverTimestamp(),
        };
        await setDoc(profileRef, defaultProfile);
        setProfile({
          displayName: defaultProfile.displayName,
          description: defaultProfile.description,
        });
        setEditName(defaultProfile.displayName);
        setEditDesc(defaultProfile.description);
      }
    };

    fetchProfile();

    // Subscribe to Links
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

  const handleAddLink = async (newLink: Omit<LinkItem, "id">) => {
    if (!user) return;
    try {
      const linkToAdd = {
        ...newLink,
        icon: determineIcon(newLink.url, newLink.title), 
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const linksRef = collection(db, "users", user.uid, "links");
      await addDoc(linksRef, linkToAdd);
    } catch (error) {
      console.error("Error adding link: ", error);
      toast.error("링크를 추가하는 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, {
        displayName: editName,
        description: editDesc,
        updatedAt: serverTimestamp(),
      });
      setProfile({ displayName: editName, description: editDesc });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-6 text-center text-zinc-100">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20">
          <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[100px]" />
        </div>

        <div className="relative z-10 flex max-w-md flex-col items-center gap-8">
          <div className="space-y-4">
            <h1 className="bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-5xl font-black tracking-tight text-transparent">
              MyLink
            </h1>
            <p className="text-lg text-zinc-400">
              개발자를 위한 통합 링크 프로필 서비스.<br />
              흩어져 있는 당신의 링크를 한곳에 모아보세요.
            </p>
          </div>
          
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-bold">시작하기</h2>
            <p className="mb-6 text-sm text-zinc-400">
              로그인 후 나만의 프로필 페이지를 만들고<br />
              다양한 소셜 링크를 관리할 수 있습니다.
            </p>
            <Button 
              size="lg" 
              onClick={loginWithGoogle}
              className="w-full bg-indigo-600 font-bold hover:bg-indigo-500"
            >
              Google로 시작하기
            </Button>
          </div>
          
          <footer className="text-sm text-zinc-500">
            Powered by MyLink
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
              <div className="flex flex-col gap-3">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-transparent text-center text-4xl font-extrabold tracking-tight text-white outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg px-2"
                  placeholder="이름"
                  autoFocus
                />
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="bg-transparent text-center text-zinc-400 font-medium tracking-wide text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg px-2"
                  placeholder="소개글"
                />
                <div className="mt-2 flex justify-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingProfile(false)}>취소</Button>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500" onClick={handleUpdateProfile}>저장</Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mb-2 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
                  {profile.displayName}
                </h1>
                <p className="text-zinc-400 font-medium tracking-wide text-sm">
                  {profile.description}
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
            <AddLinkDialog onAdd={handleAddLink} />
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

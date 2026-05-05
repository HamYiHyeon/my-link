"use client";

import { use } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  orderBy, 
  limit 
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  InstagramIcon, 
  YoutubeIcon, 
  Book02Icon, 
  GlobalIcon, 
  UserIcon, 
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const decodedName = decodeURIComponent(username);

  // 1. 유저 정보 조회 (displayName → username → UID 순서로 검색)
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["public-profile", decodedName],
    queryFn: async () => {
      // 1차: displayName으로 검색
      const nameQuery = query(collection(db, "users"), where("displayName", "==", decodedName), limit(1));
      const nameSnap = await getDocs(nameQuery);
      
      if (!nameSnap.empty) {
        const d = nameSnap.docs[0];
        return { id: d.id, ...d.data() } as {
          id: string; displayName: string; description: string; username: string; photoURL?: string; email?: string;
        };
      }

      // 2차: username으로 검색 (하위 호환성)
      const usernameQuery = query(collection(db, "users"), where("username", "==", decodedName), limit(1));
      const usernameSnap = await getDocs(usernameQuery);
      
      if (!usernameSnap.empty) {
        const d = usernameSnap.docs[0];
        return { id: d.id, ...d.data() } as {
          id: string; displayName: string; description: string; username: string; photoURL?: string; email?: string;
        };
      }

      // 3차: UID로 직접 조회 (하위 호환성)
      const userRef = doc(db, "users", decodedName);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as {
          id: string; displayName: string; description: string; username: string; photoURL?: string; email?: string;
        };
      }
      
      return null;
    }
  });

  // 2. 링크 목록 조회 (유저 ID로 조회)
  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ["public-links", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];
      const linksRef = collection(db, "users", userData.id, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
    },
    enabled: !!userData?.id
  });

  if (userLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!userData) {
    return notFound();
  }

  return (
    <div className="flex min-h-svh justify-center bg-zinc-950 px-6 py-24 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20">
        <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 animate-fade-in-up">
        {/* Profile Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-2 border-zinc-700 shadow-lg mb-5">
            <AvatarImage src={userData.photoURL || ""} alt={userData.displayName} />
            <AvatarFallback className="bg-zinc-800 text-zinc-300 text-2xl font-bold">
              {userData.displayName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <h1 className="mb-2 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
            {userData.displayName}
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-widest mt-1 mb-3">
            @{userData.username}
          </p>
          <p className="text-zinc-400 font-medium tracking-wide text-sm max-w-xs">
            {userData.description}
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-4">
          {linksLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          ) : links?.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <p>아직 등록된 링크가 없습니다.</p>
            </div>
          ) : (
            links?.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full outline-none"
              >
                <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-zinc-700/80 hover:bg-zinc-800/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-indigo-500/10">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300 shadow-inner ring-1 ring-white/5 transition-colors duration-300 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 group-hover:ring-indigo-500/30">
                        {getIconRenderer(link.icon)}
                      </div>
                      <span className="text-base font-semibold text-zinc-200 transition-colors duration-300 group-hover:text-white">
                        {link.title}
                      </span>
                    </div>
                    <div className="text-zinc-600 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-zinc-300">
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
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

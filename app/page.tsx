"use client";

import { useState, useEffect } from "react";
import { LinkItem } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { 
  InstagramIcon, 
  YoutubeIcon, 
  Book02Icon, 
  GlobalIcon, 
  UserIcon, 
  ArrowRight01Icon 
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

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

export default function Page() {
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    // Firebase Firestore에서 'links' 컬렉션을 구독하여 실시간으로 가져옵니다.
    const q = query(collection(db, "links"), orderBy("createdAt", "asc"));
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
  }, []);

  const handleAddLink = async (newLink: Omit<LinkItem, "id">) => {
    try {
      const linkToAdd = {
        ...newLink,
        icon: "user", 
        createdAt: serverTimestamp(),
      };
      
      // Firestore의 'links' 컬렉션에 새 문서 추가
      await addDoc(collection(db, "links"), linkToAdd);
    } catch (error) {
      console.error("Error adding link: ", error);
      alert("링크를 추가하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex min-h-svh justify-center bg-zinc-950 px-6 py-12 text-zinc-100 selection:bg-zinc-800">
      {/* Subtle Mesh/Glow Background */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20">
        <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mt-16 flex w-full max-w-md flex-col gap-6 animate-fade-in-up">
        <div className="mb-10 text-center">
          <h1 className="mb-2 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
            MyProfile
          </h1>
          <p className="text-zinc-400 font-medium tracking-wide text-sm">
            Developer | Creator | Builder
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Add Link Dialog at the top */}
          <div className="mb-2">
            <AddLinkDialog onAdd={handleAddLink} />
          </div>

          {links.map((link) => (
            <Link
              href={link.url}
              key={link.id}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full outline-none"
            >
              <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-zinc-700/80 hover:bg-zinc-800/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-indigo-500/10">
                {/* Subtle top glare effect */}
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
          ))}
        </div>
      </div>
    </div>
  );
}

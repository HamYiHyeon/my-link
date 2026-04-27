"use client";

import { useState, useEffect } from "react";
import { LinkItem } from "@/data/links";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { LinkItemCard } from "@/components/link-item-card";

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
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    // Firebase Firestore에서 'links' 컬렉션을 구독하여 실시간으로 가져옵니다.
    const q = query(collection(db, "links"), orderBy("createdAt", "desc"));
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
        icon: determineIcon(newLink.url, newLink.title), 
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
            <LinkItemCard key={link.id} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
}

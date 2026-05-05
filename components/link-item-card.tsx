"use client";

import { useState } from "react";
import { LinkItem } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  InstagramIcon, 
  YoutubeIcon, 
  Book02Icon, 
  GlobalIcon, 
  UserIcon, 
  ArrowRight01Icon,
  PencilEdit02Icon,
  Delete02Icon
} from "@hugeicons/core-free-icons";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";

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

interface LinkItemCardProps {
  link: LinkItem;
}

export function LinkItemCard({ link }: LinkItemCardProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editUrl || !user) return;

    let validUrl = editUrl;
    if (!/^https?:\/\//i.test(editUrl)) {
      validUrl = `https://${editUrl}`;
    }

    setIsUpdating(true);
    try {
      const docRef = doc(db, "users", user.uid, "links", link.id);
      await updateDoc(docRef, {
        title: editTitle,
        url: validUrl,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("링크를 수정하는 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      const docRef = doc(db, "users", user.uid, "links", link.id);
      await deleteDoc(docRef);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("링크를 삭제하는 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="relative overflow-hidden border border-zinc-700 bg-zinc-900/60 p-5 shadow-lg">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="링크 이름 (예: 인스타그램)"
              className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid gap-2">
            <Input 
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="URL (예: https://instagram.com/)"
              className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setIsEditing(false);
                setEditTitle(link.title);
                setEditUrl(link.url);
              }} 
              className="text-zinc-400 hover:text-white"
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              disabled={isUpdating}
            >
              {isUpdating ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <>
      <Link
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group w-full outline-none block"
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
            <div className="flex items-center gap-2">
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-colors hover:bg-blue-500/20"
                title="수정"
              >
                <HugeiconsIcon icon={PencilEdit02Icon} className="w-4 h-4" />
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20"
                title="삭제"
              >
                <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
              </div>
              <div className="ml-2 text-zinc-600 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-zinc-300">
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
              정말 삭제하시겠습니까?
            </DialogTitle>
            <DialogDescription className="text-zinc-400 mt-2">
              <span className="font-semibold text-zinc-200 block mb-2">[{link.title}] 링크를 삭제합니다.</span>
              <span className="text-red-500 font-medium">이 작업은 되돌릴 수 없습니다.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-zinc-300 hover:text-white"
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold"
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

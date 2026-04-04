"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { LinkItem } from "@/data/links";

interface AddLinkDialogProps {
  onAdd: (link: Omit<LinkItem, "id">) => void;
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    // Basic URL validation
    let validUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      validUrl = `https://${url}`;
    }

    onAdd({
      title,
      url: validUrl,
    });
    
    // Reset and close
    setTitle("");
    setUrl("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button 
            variant="ghost" 
            className="group relative w-full h-14 overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 px-6 backdrop-blur-md transition-all duration-500 hover:border-indigo-500/50 hover:bg-zinc-800/60"
          >
            {/* Hover Shine Effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-400 ring-1 ring-white/5 transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 group-hover:ring-indigo-500/30 group-hover:scale-110">
                <HugeiconsIcon icon={Add01Icon} className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold tracking-tight text-zinc-300 transition-colors duration-300 group-hover:text-white">
                새 링크 추가하기
              </span>
            </div>
            
            {/* Subtle bottom glow */}
            <div className="absolute -bottom-1 left-1/2 h-8 w-24 -translate-x-1/2 bg-indigo-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
              새 링크 추가
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              공유하고 싶은 사이트의 이름과 URL을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-zinc-300">이름</Label>
              <Input
                id="title"
                placeholder="예: 인스타그램, 포트폴리오 등"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url" className="text-zinc-300">URL</Label>
              <Input
                id="url"
                placeholder="예: instagram.com/username"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors w-full"
            >
              추가 완료
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

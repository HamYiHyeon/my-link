import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <main className="flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Profile Avatar Placeholder */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            <span className="text-4xl font-bold text-zinc-400">함</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            함이현
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            안녕하세요. 바이브 코딩을 배우고 있는 대학생입니다.
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <button className="px-6 py-2 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity">
            Contact Me
          </button>
          <button className="px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            Portfolio
          </button>
        </div>
      </main>
    </div>
  );
}

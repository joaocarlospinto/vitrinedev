"use client";

import { useTransition } from "react";
import Image from "next/image";
import { ExternalLink, Info } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, onSelect }: { project: Project; onSelect?: (p: Project) => void }) {
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    startTransition(async () => {
      try {
        await fetch("/api/track-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: project.id }),
        });
      } catch {
        // ignore
      }
      window.open(project.url, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <div className="relative w-72 shrink-0 snap-start cursor-pointer overflow-hidden rounded-2xl border border-[--color-border] bg-[--card] card-hover">
      <div className="relative h-40 w-full bg-[#0b1224]">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="288px"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Sem preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white line-clamp-1">{project.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{project.description}</p>
          </div>
          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-200">
            {new URL(project.url).hostname}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <button
            onClick={handleOpen}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white text-black px-3 py-2 text-sm font-semibold hover:bg-slate-200"
          >
            <ExternalLink size={16} /> Ver site
          </button>
          <button
            onClick={() => onSelect?.(project)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-200 hover:border-white/40"
            title="Detalhes"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

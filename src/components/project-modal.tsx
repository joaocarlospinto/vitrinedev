"use client";

import { X } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[--card] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white hover:border-white/40"
        >
          <X size={16} />
        </button>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-300">Projeto</p>
          <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
          <p className="text-slate-300 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 px-3 py-1">
              {new URL(project.url).hostname}
            </span>
            {project.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-slate-200"
          >
            Abrir site
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";

export function Hero({ project }: { project: Project | null }) {
  if (!project) return null;
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-black p-8 shadow-2xl">
      <div className="absolute inset-0 opacity-40">
        {project.thumbnail_url && (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover scale-105 blur-sm"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      <div className="relative z-10 max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-300">Destaque</p>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">{project.title}</h1>
        <p className="max-w-2xl text-lg text-slate-200">{project.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-white/20 px-3 py-1">
            {new URL(project.url).hostname}
          </span>
          <button
            onClick={() => window.open(project.url, "_blank", "noopener,noreferrer")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-slate-200"
          >
            <ExternalLink size={16} /> Abrir site
          </button>
        </div>
      </div>
    </section>
  );
}

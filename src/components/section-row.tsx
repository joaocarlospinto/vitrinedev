"use client";

import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";

export function SectionRow({ title, projects, onSelect }: { title: string; projects: Project[]; onSelect?: (p: Project) => void }) {
  if (!projects.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="text-xs text-slate-400">{projects.length} projetos</span>
      </div>
      <div className="carousel flex gap-4 overflow-x-auto pb-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

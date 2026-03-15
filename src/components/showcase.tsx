"use client";

import React from "react";
import { SectionRow } from "./section-row";
import { ProjectModal } from "./project-modal";
import { Hero } from "./hero";
import type { Project } from "@/lib/types";

function groupProjects(projects: Project[]) {
  const featured = projects.find((p) => p.featured) || projects[0] || null;
  const recent = [...projects].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 12);
  const trending = [...projects]
    .filter((p) => (p.clicks ?? 0) > 0)
    .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
    .slice(0, 12);
  return { featured, recent, trending, all: projects };
}

export function Showcase({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = React.useState<Project | null>(null);
  const grouped = groupProjects(projects);

  return (
    <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16">
      <Hero project={grouped.featured} />
      <SectionRow title="Todos" projects={grouped.all} onSelect={setSelected} />
      <SectionRow title="Recentes" projects={grouped.recent} onSelect={setSelected} />
      <SectionRow title="Em alta" projects={grouped.trending} onSelect={setSelected} />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

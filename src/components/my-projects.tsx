"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";
import { createSupabaseClient } from "@/lib/supabaseClient";

export function MyProjects() {
  const supabase = createSupabaseClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const res = await fetch("/api/projects?mine=true", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const body = await res.json();
    setProjects(body.projects ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (id: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    await fetch(`/api/projects?id=${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <p className="text-slate-300">Carregando...</p>;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Meus projetos ({projects.length})</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="relative">
            <ProjectCard project={p} />
            <button
              onClick={() => handleDelete(p.id)}
              className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-black"
              title="Remover"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {!projects.length && <p className="text-slate-400">Nenhum projeto ainda.</p>}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { ProjectForm } from "@/components/project-form";
import { MyProjects } from "@/components/my-projects";

export default function DashboardPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login?redirectTo=/dashboard");
        return;
      }
      setChecking(false);
    };
    void check();
  }, [supabase, router]);

  if (checking) {
    return <div className="px-6 py-12 text-slate-300">Carregando...</div>;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-400">Adicione ou gerencie seus projetos na vitrine.</p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/50"
        >
          Ver vitrine
        </a>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ProjectForm onCreated={() => {}} />
        <div className="rounded-2xl border border-white/10 bg-[--card] p-6 shadow-lg">
          <MyProjects />
        </div>
      </div>
    </div>
  );
}

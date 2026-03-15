import { Suspense } from "react";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { NavBar } from "@/components/nav-bar";
import { Showcase } from "@/components/showcase";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.from("projects").select("*");
  const projects = data ?? [];
  if (error) console.error(error);

  return (
    <div className="relative min-h-screen bg-[--background]">
      <NavBar />
      <Suspense fallback={<div className="text-center text-slate-300">Carregando...</div>}>
        <Showcase projects={projects} />
      </Suspense>
    </div>
  );
}

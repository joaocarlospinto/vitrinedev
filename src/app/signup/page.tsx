"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";

export default function SignupPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const { data } = await supabase.auth.signInWithPassword({ email, password });
    if (!data.session) {
      setError("Não foi possível iniciar a sessão");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Criar conta</h1>
        <p className="text-slate-400">Envie seus projetos e gerencie sua vitrine.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[--card] p-6 shadow-lg">
        <label className="block space-y-2 text-sm">
          <span className="text-slate-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/40"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="text-slate-300">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/40"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-white px-4 py-3 text-center text-black font-semibold hover:bg-slate-200 disabled:opacity-70"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Já tem conta? <Link href="/login" className="text-white underline">Entrar</Link>
      </p>
    </div>
  );
}
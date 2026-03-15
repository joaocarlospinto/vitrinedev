"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectTo(params.get("redirectTo"));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push(redirectTo || "/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Entrar</h1>
        <p className="text-slate-400">Acesse para cadastrar seu site na vitrine.</p>
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
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Não tem conta? <Link href="/signup" className="text-white underline">Criar conta</Link>
      </p>
    </div>
  );
}
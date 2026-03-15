"use client";

import { useState, FormEvent } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";

export function ProjectForm({ onCreated }: { onCreated?: () => void }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) throw new Error("Autenticação necessária");
      const token = sessionData.session.access_token;

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          url,
          title: title || undefined,
          description,
          tags: tags ? tags.split(",").map((t) => t.trim()) : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao salvar");
      }
      setUrl("");
      setTitle("");
      setDescription("");
      setTags("");
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[--card] p-6 shadow-lg">
      <div>
        <h3 className="text-xl font-semibold text-white">Adicionar projeto</h3>
        <p className="text-sm text-slate-400">Cole a URL e uma descrição curta; o preview é gerado automaticamente.</p>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="text-slate-300">URL do site</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://meusite.com"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/40"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-slate-300">Título (opcional)</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome do projeto"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/40"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-slate-300">Descrição</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/40"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-slate-300">Tags (separadas por vírgula)</span>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="frontend, design"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/40"
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-center text-black font-semibold hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Salvando..." : "Publicar"}
      </button>
    </form>
  );
}
import Link from "next/link";
import { LogIn, PlusCircle } from "lucide-react";

export function NavBar() {
  return (
    <header className="sticky top-0 z-20 mb-8 bg-gradient-to-b from-[--background] via-[--background]/95 to-transparent py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold text-white">
          Vitrine.dev
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white hover:border-white/40"
          >
            <PlusCircle size={16} /> Adicionar
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-slate-200"
          >
            <LogIn size={16} /> Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}

import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { errorResponse } from "@/lib/project-utils";

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return errorResponse("ID é obrigatório");
  const supabase = await createSupabaseServer(req.headers);
  const sb: any = supabase;

  const { error: rpcError } = await sb.rpc("increment_clicks", { project_id: id });

  if (rpcError) {
    const { data, error: readError } = await sb
      .from("projects")
      .select("clicks")
      .eq("id", id)
      .single();

    if (readError) return errorResponse(readError.message, 500);
    const current = (data as { clicks?: number } | null)?.clicks ?? 0;
    const { error: writeError } = await sb
      .from("projects")
      .update({ clicks: current + 1 })
      .eq("id", id);
    if (writeError) return errorResponse(writeError.message, 500);
  }

  return NextResponse.json({ ok: true });
}
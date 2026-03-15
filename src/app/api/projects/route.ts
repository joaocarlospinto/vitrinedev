import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { buildThumbnailUrl, errorResponse, fetchPageMetadata, isValidUrl } from "@/lib/project-utils";
import type { Database } from "@/lib/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

export async function GET(req: Request) {
  const supabase = await createSupabaseServer(req.headers);
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "true";

  if (mine) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return errorResponse("Não autenticado", 401);
    const uid = user.id as ProjectRow["user_id"];

    const { data, error } = await supabase
      .from<ProjectRow>("projects")
      .select("*")
      .eq("user_id", uid)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return errorResponse(error.message, 500);
    return NextResponse.json({ projects: data });
  }

  const { data, error } = await supabase
    .from<ProjectRow>("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return errorResponse(error.message, 500);
  return NextResponse.json({ projects: data });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServer(req.headers);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return errorResponse("Não autenticado", 401);
  const uid = user.id as ProjectRow["user_id"];

  const body = await req.json();
  const { url, description, title: providedTitle, tags } = body;
  if (!url || !description) return errorResponse("URL e descrição são obrigatórios");
  if (!isValidUrl(url)) return errorResponse("URL inválida");

  const metadata = await fetchPageMetadata(url);
  const title = providedTitle || metadata.title || new URL(url).hostname;
  const thumbnail_url = metadata.image || buildThumbnailUrl(url);
  const cleanDescription = description || metadata.description || "";

  const { data, error } = await supabase.from<ProjectRow>("projects").insert({
    user_id: uid,
    url,
    description: cleanDescription,
    title,
    thumbnail_url,
    tags: tags ?? null,
    clicks: 0,
  } satisfies ProjectInsert);

  if (error) return errorResponse(error.message, 500);
  return NextResponse.json({ project: data?.[0] }, { status: 201 });
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServer(req.headers);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return errorResponse("Não autenticado", 401);
  const uid = user.id as ProjectRow["user_id"];

  const { id, title, description, tags, featured } = await req.json();
  if (!id) return errorResponse("ID é obrigatório");

  const { data, error } = await supabase
    .from<ProjectRow>("projects")
    .update({ title, description, tags, featured })
    .eq("id", id)
    .eq("user_id", uid)
    .select();

  if (error) return errorResponse(error.message, 500);
  return NextResponse.json({ project: data?.[0] });
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServer(req.headers);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return errorResponse("Não autenticado", 401);
  const uid = user.id as ProjectRow["user_id"];

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return errorResponse("ID é obrigatório");

  const { error } = await supabase
    .from<ProjectRow>("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);

  if (error) return errorResponse(error.message, 500);
  return NextResponse.json({ success: true });
}

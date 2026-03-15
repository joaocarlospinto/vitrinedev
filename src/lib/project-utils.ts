import { NextResponse } from "next/server";

export function isValidUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function fetchPageMetadata(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const ogImageMatch = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i);
    const ogDescMatch = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);

    return {
      title: titleMatch?.[1]?.trim(),
      description: ogDescMatch?.[1]?.trim(),
      image: ogImageMatch?.[1]?.trim(),
    };
  } catch {
    return { title: undefined, description: undefined, image: undefined };
  }
}

export function buildThumbnailUrl(siteUrl: string) {
  const encoded = encodeURIComponent(siteUrl);
  const apiKey = process.env.THUMBNAIL_API_KEY;
  const base = process.env.THUMBNAIL_API_URL;

  if (base && apiKey) {
    return `${base}?key=${apiKey}&url=${encoded}`;
  }

  return `https://image.thum.io/get/width/900/${siteUrl}`;
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

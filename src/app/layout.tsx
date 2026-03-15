import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vitrine de Projetos",
  description:
    "Showcase estilo Netflix para projetos pessoais com login e submissão de links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased bg-[--background] text-slate-100`}
      >
        <div className="screen-gradient" />
        <div className="relative min-h-screen">{children}</div>
      </body>
    </html>
  );
}

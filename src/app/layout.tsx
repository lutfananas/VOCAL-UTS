import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ujian Speaking CBT - Bahasa Inggris Bisnis (UTW2002)",
  description:
    "Sistem Ujian Speaking Computer-Based Test (CBT) untuk mata kuliah Bahasa Inggris Bisnis - FISIP S1 Administrasi Publik. Tahun Akademik 2025/2026.",
  keywords: [
    "CBT",
    "Speaking Exam",
    "UTW2002",
    "Bahasa Inggris Bisnis",
    "FISIP",
    "Administrasi Publik",
    "UTS 2025/2026",
  ],
  authors: [{ name: "FISIP - S1 Administrasi Publik" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Ujian Speaking CBT - UTW2002",
    description: "Sistem ujian speaking online untuk mahasiswa terdaftar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

"use client";

// SplashScreen VOCAL - PUTIH BERSIH DOMINAN
// - Background putih bersih
// - Wayang gunungan terbelah di tengah
// - Foto close-up Prof. Dwi Ima besar
// - Layout compact agar muat di viewport 100% (tidak terpotong)

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
}

const PROFILES: string[] = [
  "Memuat bahan ujian...",
  "Menyiapkan ruang virtual...",
  "Mengaktifkan mikrofon...",
  "Memuat kearifan lokal...",
];

export function SplashScreen({
  onFinished,
  duration = 8000,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [profileIdx, setProfileIdx] = useState(0);
  const [hide, setHide] = useState(false);
  const [gununganOpen, setGununganOpen] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => setGununganOpen(true), 1500);

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      const idx = Math.min(
        PROFILES.length - 1,
        Math.floor((pct / 100) * PROFILES.length)
      );
      setProfileIdx(idx);

      if (elapsed >= duration) {
        clearInterval(interval);
        setHide(true);
        setTimeout(() => onFinished(), 500);
      }
    }, 50);
    return () => {
      clearInterval(interval);
      clearTimeout(openTimer);
    };
  }, [duration, onFinished]);

  const handleSkip = () => {
    setHide(true);
    setTimeout(() => onFinished(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
        hide ? "opacity-0" : "opacity-100"
      } overflow-y-auto`}
      style={{ background: "#ffffff" }}
    >
      {/* === ORNAMEN BATIK ATAS (pembatas) - fixed === */}
      <div className="sticky top-0 left-0 right-0 h-2 bg-gradient-to-r from-dongker via-merah to-dongker z-20" />

      {/* === Corner ornaments - halus === */}
      <div className="fixed top-6 left-6 text-xl text-dongker/30 animate-fade-in delay-300 z-10" aria-hidden>❋</div>
      <div className="fixed top-6 right-6 text-xl text-merah/30 animate-fade-in delay-300 z-10" aria-hidden>❋</div>
      <div className="fixed bottom-6 left-6 text-xl text-merah/30 animate-fade-in delay-300 z-10" aria-hidden>❋</div>
      <div className="fixed bottom-6 right-6 text-xl text-dongker/30 animate-fade-in delay-300 z-10" aria-hidden>❋</div>

      {/* === MAIN CONTENT - compact, scrollable === */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-8 md:py-12">

        {/* Top: Logos (smaller, compact) */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-3 animate-fade-up">
          <img
            src="/logos/universitas-tulungagung.png"
            alt="Logo Universitas Tulungagung"
            className="h-14 md:h-20 w-auto object-contain drop-shadow-md"
          />
          <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-dongker/40 to-transparent" />
          <img
            src="/logos/universitas-bhinneka-pgri.png"
            alt="Logo Universitas Bhinneka PGRI"
            className="h-14 md:h-20 w-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Sambutan Sugeng Rawuh - small */}
        <p className="font-display text-xs md:text-base text-dongker italic mb-1 animate-fade-up delay-200 tracking-wide">
          ❋ Sugeng Rawuh ❋
        </p>

        {/* === TITLE VOCAL - compact size === */}
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-1 tracking-wide shimmer-blue animate-scale-in delay-500"
          style={{ color: "#1e3a8a" }}
        >
          VOCAL
        </h1>
        <p className="text-[10px] md:text-sm text-slate-500 italic mb-3 tracking-wider font-display animate-fade-up delay-700 uppercase">
          Voice Of Cultural And Local Wisdom
        </p>

        {/* Batik divider - compact */}
        <div className="flex items-center justify-center gap-2 mb-3 animate-fade-in delay-1000">
          <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-dongker/60" />
          <span className="text-dongker text-base">❋</span>
          <span className="h-px w-2 bg-merah/60" />
          <span className="text-merah text-sm">◆</span>
          <span className="h-px w-2 bg-merah/60" />
          <span className="text-dongker text-base">❋</span>
          <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-dongker/60" />
        </div>

        {/* Subtitle / Tagline - compact */}
        <div className="max-w-2xl mx-auto mb-4 space-y-0.5 animate-fade-up delay-1500">
          <p className="text-sm md:text-lg text-slate-800 font-display leading-snug">
            Inovasi Pembelajaran Digital Speaking
          </p>
          <p className="text-xs md:text-base text-slate-500 font-display italic leading-snug">
            Berbasis Kearifan Lokal untuk Mewujudkan
          </p>
          <p
            className="text-base md:text-2xl font-display font-bold leading-snug mt-1"
            style={{ color: "#c8102e" }}
          >
            Kampus Berdampak
          </p>
        </div>

        {/* === WAYANG GUNUNGAN TERBELAH + PHOTO REVEAL - compact === */}
        <div
          className="relative mx-auto mb-4"
          style={{ width: "min(260px, 65vw)", height: "min(290px, 72vw)" }}
        >
          {/* Decorative outer rings - rotating, very subtle */}
          <div
            className="absolute rounded-full border border-dongker/20 animate-spin-slow"
            style={{
              top: "50%",
              left: "50%",
              width: "min(280px, 70vw)",
              height: "min(280px, 70vw)",
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden
          />
          <div
            className="absolute rounded-full border border-merah/20 animate-spin-reverse"
            style={{
              top: "50%",
              left: "50%",
              width: "min(255px, 64vw)",
              height: "min(255px, 64vw)",
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden
          />

          {/* Soft glow behind gunungan - subtle blue */}
          <div
            className={`absolute rounded-full transition-all duration-1000 ${
              gununganOpen ? "gunungan-glow" : ""
            }`}
            style={{
              top: "50%",
              left: "50%",
              width: "min(230px, 58vw)",
              height: "min(230px, 58vw)",
              transform: "translate(-50%, -50%)",
              background: gununganOpen
                ? "radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)"
                : "transparent",
            }}
            aria-hidden
          />

          {/* GUNUNGAN HALVES */}
          <div
            className={`absolute inset-0 ${gununganOpen ? "gunungan-open" : ""}`}
            style={{
              width: "min(230px, 58vw)",
              height: "min(280px, 70vw)",
              margin: "auto",
            }}
          >
            {/* Left half */}
            <div className="gunungan-left">
              <div className="gunungan-pattern" />
              <div className="absolute top-1/4 right-1 text-dongker text-base opacity-70">❋</div>
              <div className="absolute bottom-1/4 right-3 text-merah text-sm opacity-70">◆</div>
            </div>
            {/* Right half */}
            <div className="gunungan-right">
              <div className="gunungan-pattern" />
              <div className="absolute top-1/4 left-1 text-dongker text-base opacity-70">❋</div>
              <div className="absolute bottom-1/4 left-3 text-merah text-sm opacity-70">◆</div>
            </div>

            {/* PHOTO revealed inside gunungan - portrait oval */}
            <div className="gunungan-content">
              <div className="relative">
                <div
                  className="border-4 border-white shadow-2xl overflow-hidden"
                  style={{
                    width: "min(180px, 45vw)",
                    height: "min(245px, 61vw)",
                    borderRadius: "min(90px, 22vw)",
                    boxShadow: "0 8px 30px rgba(30, 58, 138, 0.25), 0 0 0 2px rgba(200, 16, 46, 0.15)",
                  }}
                >
                  <img
                    src="/logos/prof-dwi-ima.png"
                    alt="Foto Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute -top-1 -left-1 text-dongker text-sm">❋</span>
                <span className="absolute -top-1 -right-1 text-merah text-sm">❋</span>
                <span className="absolute -bottom-1 -left-1 text-merah text-sm">❋</span>
                <span className="absolute -bottom-1 -right-1 text-dongker text-sm">❋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professor name & info - compact */}
        <div
          className={`space-y-0.5 transition-all duration-700 ${
            gununganOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: gununganOpen ? "1s" : "0s" }}
        >
          <p
            className="text-sm md:text-xl font-bold font-display"
            style={{ color: "#172554" }}
          >
            Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum
          </p>
          <p className="text-[10px] md:text-sm text-dongker italic">
            Dosen Pengampu Mata Kuliah Bahasa Inggris Bisnis (UTW2002)
          </p>
          <p className="text-[9px] md:text-xs text-slate-500">
            FISIP & FKIP &middot; S1 Adpub UNITA × S1 PGSD UBHI &middot; Program Kolaborasi
          </p>
        </div>

        {/* Loading progress - compact */}
        <div className="max-w-xs mx-auto space-y-1 mt-4">
          <div className="flex items-center justify-center gap-2 text-dongker">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-[10px] md:text-sm font-display italic">
              {PROFILES[profileIdx]}
            </span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-dongker via-merah to-dongker transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-400">
            {Math.floor(progress)}%
          </p>
        </div>

        {/* Footer - compact */}
        <div className="mt-4 pt-2 border-t border-slate-100 max-w-md">
          <p className="text-[9px] md:text-xs text-slate-500 italic font-display">
            &ldquo;Budaya kui dudu wates, nangan dadi identitas&rdquo;
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">
            &ldquo;Budaya bukan batas, melainkan identitas&rdquo;
          </p>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="mt-3 text-[10px] text-slate-400 hover:text-dongker underline-offset-2 hover:underline transition-colors"
        >
          Lewati pembuka →
        </button>
      </div>

      {/* === ORNAMEN BATIK BAWAH - fixed === */}
      <div className="sticky bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-dongker via-merah to-dongker z-20" />
    </div>
  );
}

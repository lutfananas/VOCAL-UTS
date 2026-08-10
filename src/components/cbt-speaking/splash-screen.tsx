"use client";

// SplashScreen VOCAL - PUTIH BERSIH DOMINAN
// - Background putih bersih (bukan dongker/kuning)
// - Wayang gunungan terbelah di tengah (border dongker + merah, isi putih)
// - Foto close-up Prof. Dwi Ima besar di tengah (no background PNG)
// - Logo kampus transparan
// - Batik hanya sebagai ornamen pembatas (bukan background)
// - Tipografi clean, modern, profesional

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
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        hide ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "#ffffff" }}
    >
      {/* === ORNAMEN BATIK ATAS (pembatas) === */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-dongker via-merah to-dongker" />

      {/* === ORNAMEN BATIK BAWAH (pembatas) === */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-dongker via-merah to-dongker" />

      {/* === Corner ornaments - halus === */}
      <div className="absolute top-8 left-8 text-2xl text-dongker/30 animate-fade-in delay-300" aria-hidden>❋</div>
      <div className="absolute top-8 right-8 text-2xl text-merah/30 animate-fade-in delay-300" aria-hidden>❋</div>
      <div className="absolute bottom-8 left-8 text-2xl text-merah/30 animate-fade-in delay-300" aria-hidden>❋</div>
      <div className="absolute bottom-8 right-8 text-2xl text-dongker/30 animate-fade-in delay-300" aria-hidden>❋</div>

      {/* === MAIN CONTENT - PUTIH BERSIH === */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-8 text-center">

        {/* Top: Logos (transparent PNGs, no wrapper) */}
        <div className="flex items-center justify-center gap-6 md:gap-12 mb-6 animate-fade-up">
          <img
            src="/logos/universitas-tulungagung.png"
            alt="Logo Universitas Tulungagung"
            className="h-20 md:h-24 w-auto object-contain drop-shadow-md"
          />
          <div className="hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-dongker/40 to-transparent" />
          <img
            src="/logos/universitas-bhinneka-pgri.png"
            alt="Logo Universitas Bhinneka PGRI"
            className="h-20 md:h-24 w-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Sambutan Sugeng Rawuh - small */}
        <p className="font-display text-sm md:text-base text-dongker italic mb-2 animate-fade-up delay-200 tracking-wide">
          ❋ Sugeng Rawuh ❋
        </p>

        {/* === TITLE VOCAL - clean, elegant, dongker === */}
        <h1
          className="font-display text-7xl md:text-9xl font-bold mb-2 tracking-wide shimmer-blue animate-scale-in delay-500"
          style={{ color: "#1e3a8a" }}
        >
          VOCAL
        </h1>
        <p className="text-xs md:text-sm text-slate-500 italic mb-6 tracking-wider font-display animate-fade-up delay-700 uppercase">
          Voice Of Cultural And Local Wisdom
        </p>

        {/* Batik divider - ornamen */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in delay-1000">
          <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-dongker/60" />
          <span className="text-dongker text-lg">❋</span>
          <span className="h-px w-3 bg-merah/60" />
          <span className="text-merah text-base">◆</span>
          <span className="h-px w-3 bg-merah/60" />
          <span className="text-dongker text-lg">❋</span>
          <span className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-dongker/60" />
        </div>

        {/* Subtitle / Tagline */}
        <div className="max-w-2xl mx-auto mb-8 space-y-1 animate-fade-up delay-1500">
          <p className="text-base md:text-lg text-slate-800 font-display leading-relaxed">
            Inovasi Pembelajaran Digital Speaking
          </p>
          <p className="text-sm md:text-base text-slate-500 font-display italic leading-relaxed">
            Berbasis Kearifan Lokal untuk Mewujudkan
          </p>
          <p
            className="text-xl md:text-3xl font-display font-bold leading-relaxed mt-2"
            style={{ color: "#c8102e" }}
          >
            Kampus Berdampak
          </p>
        </div>

        {/* === WAYANG GUNUNGAN TERBELAH + PHOTO REVEAL === */}
        <div className="relative mx-auto mb-8" style={{ width: "min(320px, 75vw)", height: "min(360px, 82vw)" }}>
          {/* Decorative outer rings - rotating, very subtle */}
          <div
            className="absolute rounded-full border border-dongker/20 animate-spin-slow"
            style={{
              top: "50%",
              left: "50%",
              width: "min(340px, 80vw)",
              height: "min(340px, 80vw)",
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden
          />
          <div
            className="absolute rounded-full border border-merah/20 animate-spin-reverse"
            style={{
              top: "50%",
              left: "50%",
              width: "min(310px, 73vw)",
              height: "min(310px, 73vw)",
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
              width: "min(280px, 65vw)",
              height: "min(280px, 65vw)",
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
              width: "min(280px, 65vw)",
              height: "min(340px, 78vw)",
              margin: "auto",
            }}
          >
            {/* Left half */}
            <div className="gunungan-left">
              <div className="gunungan-pattern" />
              {/* Decorative ornaments on left half */}
              <div className="absolute top-1/4 right-1 text-dongker text-xl opacity-70">❋</div>
              <div className="absolute bottom-1/4 right-3 text-merah text-base opacity-70">◆</div>
            </div>
            {/* Right half */}
            <div className="gunungan-right">
              <div className="gunungan-pattern" />
              {/* Decorative ornaments on right half */}
              <div className="absolute top-1/4 left-1 text-dongker text-xl opacity-70">❋</div>
              <div className="absolute bottom-1/4 left-3 text-merah text-base opacity-70">◆</div>
            </div>

            {/* PHOTO revealed inside gunungan - LARGE close-up */}
            <div className="gunungan-content">
              <div className="relative">
                {/* Photo container - large close-up with elegant border */}
                <div
                  className="rounded-full border-4 border-white shadow-2xl overflow-hidden"
                  style={{
                    width: "min(240px, 55vw)",
                    height: "min(240px, 55vw)",
                    boxShadow: "0 10px 40px rgba(30, 58, 138, 0.25), 0 0 0 2px rgba(200, 16, 46, 0.15)",
                  }}
                >
                  <img
                    src="/logos/prof-dwi-ima.png"
                    alt="Foto Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Corner stars on photo - alternating colors */}
                <span className="absolute -top-2 -left-2 text-dongker text-lg">❋</span>
                <span className="absolute -top-2 -right-2 text-merah text-lg">❋</span>
                <span className="absolute -bottom-2 -left-2 text-merah text-lg">❋</span>
                <span className="absolute -bottom-2 -right-2 text-dongker text-lg">❋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professor name & info - revealed after gunungan opens */}
        <div
          className={`space-y-1 transition-all duration-700 ${
            gununganOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: gununganOpen ? "1s" : "0s" }}
        >
          <p
            className="text-lg md:text-2xl font-bold font-display"
            style={{ color: "#172554" }}
          >
            Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum
          </p>
          <p className="text-xs md:text-sm text-dongker italic">
            Dosen Pengampu Mata Kuliah Bahasa Inggris Bisnis (UTW2002)
          </p>
          <p className="text-[10px] md:text-xs text-slate-500">
            FISIP &middot; S1 Administrasi Publik &middot; Universitas Tulungagung
          </p>
        </div>

        {/* Loading progress */}
        <div className="max-w-md mx-auto space-y-2 mt-6">
          <div className="flex items-center justify-center gap-2 text-dongker">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs md:text-sm font-display italic">
              {PROFILES[profileIdx]}
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-dongker via-merah to-dongker transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            {Math.floor(progress)}%
          </p>
        </div>

        {/* Footer - elegant */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <p className="text-[10px] md:text-xs text-slate-500 italic font-display">
            &ldquo;Budaya kui dudu wates, nanging dadi identitas&rdquo;
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            &ldquo;Budaya bukan batas, melainkan identitas&rdquo;
          </p>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="mt-6 text-[10px] text-slate-400 hover:text-dongker underline-offset-2 hover:underline transition-colors"
        >
          Lewati pembuka →
        </button>
      </div>
    </div>
  );
}

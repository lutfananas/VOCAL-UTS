"use client";

// SplashScreen VOCAL dengan animasi wayang gunungan terbelah
// - Background: animated scrolling batik parang (biru dongker + merah)
// - Opening: wayang gunungan (mountain shape) yang terbelah di tengah
// - Reveal: foto close-up Prof. Dwi Ima (no background)
// - Logo kampus: transparent PNG (no background)

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
    // Open gunungan after 1.5s (let entrance animation play first)
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
    >
      {/* === BACKGROUND LAYERS === */}

      {/* Base gradient dongker pekat */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0f1428 0%, #172554 25%, #1e3a8a 50%, #172554 75%, #0f1428 100%)",
        }}
        aria-hidden
      />

      {/* Animated scrolling batik parang (background movement) */}
      <div className="absolute inset-0 batik-parang-anim opacity-50" aria-hidden />

      {/* Radial glow emas in center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,162,39,0.25) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 text-3xl md:text-4xl text-emas opacity-60 animate-fade-in delay-300" aria-hidden>❋</div>
      <div className="absolute top-6 right-6 text-3xl md:text-4xl text-emas opacity-60 animate-fade-in delay-300" aria-hidden>❋</div>
      <div className="absolute bottom-6 left-6 text-3xl md:text-4xl text-emas opacity-60 animate-fade-in delay-300" aria-hidden>❋</div>
      <div className="absolute bottom-6 right-6 text-3xl md:text-4xl text-emas opacity-60 animate-fade-in delay-300" aria-hidden>❋</div>

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-8 text-center">

        {/* Top: Logos (transparent PNGs) */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-6 animate-fade-up">
          <img
            src="/logos/universitas-tulungagung.png"
            alt="Logo Universitas Tulungagung"
            className="h-16 md:h-20 w-auto object-contain drop-shadow-lg"
          />
          <img
            src="/logos/universitas-bhinneka-pgri.png"
            alt="Logo Universitas Bhinneka PGRI"
            className="h-16 md:h-20 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Sambutan Sugeng Rawuh */}
        <p className="font-display text-base md:text-xl text-emas-light italic mb-2 animate-fade-up delay-200">
          ❋ Sugeng Rawuh ❋
        </p>

        {/* === TITLE VOCAL with shimmer === */}
        <h1 className="font-display text-6xl md:text-8xl font-bold text-emas mb-2 tracking-wide shimmer-gold animate-scale-in delay-500">
          VOCAL
        </h1>
        <p className="text-xs md:text-sm text-krem/90 italic mb-6 tracking-wide font-display animate-fade-up delay-700">
          Voice Of Cultural And Local Wisdom
        </p>

        {/* Subtitle / Tagline */}
        <div className="max-w-2xl mx-auto mb-8 space-y-1.5 animate-fade-up delay-1000">
          <p className="text-sm md:text-base text-krem font-display leading-relaxed">
            Inovasi Pembelajaran Digital Speaking
          </p>
          <p className="text-sm md:text-base text-krem/85 font-display italic leading-relaxed">
            Berbasis Kearifan Lokal untuk Mewujudkan
          </p>
          <p className="text-lg md:text-2xl text-emas-light font-display font-semibold leading-relaxed">
            Kampus Berdampak
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in delay-1500">
          <span className="h-px w-16 md:w-24 bg-emas/60" />
          <span className="text-emas text-xl">❋</span>
          <span className="h-px w-16 md:w-24 bg-emas/60" />
        </div>

        {/* === WAYANG GUNUNGAN TERBELAH + PHOTO REVEAL === */}
        <div className="relative mx-auto mb-8" style={{ width: "min(360px, 80vw)", height: "min(380px, 85vw)" }}>
          {/* Decorative outer rings - rotating */}
          <div
            className="absolute rounded-full border-2 border-emas/40 animate-spin-slow"
            style={{
              top: "50%",
              left: "50%",
              width: "min(360px, 80vw)",
              height: "min(360px, 80vw)",
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden
          />
          <div
            className="absolute rounded-full border border-emas/30 animate-spin-reverse"
            style={{
              top: "50%",
              left: "50%",
              width: "min(330px, 73vw)",
              height: "min(330px, 73vw)",
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden
          />

          {/* Glowing circle behind gunungan */}
          <div
            className={`absolute rounded-full transition-all duration-1000 ${
              gununganOpen ? "gunungan-glow" : ""
            }`}
            style={{
              top: "50%",
              left: "50%",
              width: "min(300px, 67vw)",
              height: "min(300px, 67vw)",
              transform: "translate(-50%, -50%)",
              background: gununganOpen
                ? "radial-gradient(circle, rgba(201,162,39,0.25) 0%, transparent 70%)"
                : "transparent",
            }}
            aria-hidden
          />

          {/* GUNUNGAN HALVES - closed at start, split open when gununganOpen */}
          <div
            className={`absolute inset-0 ${gununganOpen ? "gunungan-open" : ""}`}
            style={{ width: "min(280px, 62vw)", height: "min(340px, 76vw)", margin: "auto" }}
          >
            {/* Left half of gunungan */}
            <div className="gunungan-left">
              <div className="gunungan-pattern" />
              {/* Decorative ornament on left half */}
              <div className="absolute top-1/4 right-2 text-emas text-2xl opacity-70">❋</div>
              <div className="absolute bottom-1/4 right-4 text-emas text-xl opacity-60">❋</div>
            </div>
            {/* Right half of gunungan */}
            <div className="gunungan-right">
              <div className="gunungan-pattern" />
              {/* Decorative ornament on right half */}
              <div className="absolute top-1/4 left-2 text-emas text-2xl opacity-70">❋</div>
              <div className="absolute bottom-1/4 left-4 text-emas text-xl opacity-60">❋</div>
            </div>

            {/* PHOTO revealed inside gunungan */}
            <div className="gunungan-content">
              {/* Photo container - large close-up */}
              <div className="relative">
                {/* Decorative ring around photo */}
                <div
                  className="rounded-full border-4 border-emas shadow-2xl overflow-hidden"
                  style={{
                    width: "min(220px, 50vw)",
                    height: "min(220px, 50vw)",
                  }}
                >
                  <img
                    src="/logos/prof-dwi-ima.png"
                    alt="Foto Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Corner stars on photo */}
                <span className="absolute -top-2 -left-2 text-emas text-lg">❋</span>
                <span className="absolute -top-2 -right-2 text-emas text-lg">❋</span>
                <span className="absolute -bottom-2 -left-2 text-emas text-lg">❋</span>
                <span className="absolute -bottom-2 -right-2 text-emas text-lg">❋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professor name & info (revealed after gunungan opens) */}
        <div
          className={`space-y-1 transition-all duration-700 ${
            gununganOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: gununganOpen ? "1s" : "0s" }}
        >
          <p className="text-lg md:text-2xl font-bold text-krem font-display">
            Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum
          </p>
          <p className="text-xs md:text-sm text-emas-light italic">
            Dosen Pengampu Mata Kuliah Bahasa Inggris Bisnis (UTW2002)
          </p>
          <p className="text-[10px] md:text-xs text-krem/60">
            FISIP &middot; S1 Administrasi Publik &middot; Universitas Tulungagung
          </p>
        </div>

        {/* Loading progress */}
        <div className="max-w-md mx-auto space-y-2 mt-6">
          <div className="flex items-center justify-center gap-2 text-emas-light">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs md:text-sm font-display italic">
              {PROFILES[profileIdx]}
            </span>
          </div>
          <div className="h-1 bg-emas/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emas via-emas-light to-emas transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-krem/50">
            {Math.floor(progress)}%
          </p>
        </div>

        {/* Footer note */}
        <div className="mt-8 pt-4 border-t border-emas/20">
          <p className="text-[10px] md:text-xs text-krem/60 italic font-display">
            &ldquo;Budaya kui dudu wates, nanging dadi identitas&rdquo;
          </p>
          <p className="text-[10px] text-krem/40 mt-1">
            &ldquo;Budaya bukan batas, melainkan identitas&rdquo;
          </p>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="mt-6 text-[10px] text-emas/70 hover:text-emas-light underline-offset-2 hover:underline transition-colors"
        >
          Lewati pembuka →
        </button>
      </div>
    </div>
  );
}

"use client";

// SplashScreen - Opening Berbudaya "VOCAL"
// Voice Of Cultural And Local Wisdom
// Inovasi Pembelajaran Digital Speaking Berbasis Kearifan Lokal
// untuk Mewujudkan Kampus Berdampak
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface SplashScreenProps {
  onFinished: () => void;
  /** Durasi splash screen sebelum auto-dismiss (ms). Default 7000ms */
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
  duration = 7000,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [profileIdx, setProfileIdx] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      // Cycle through profile messages
      const idx = Math.min(
        PROFILES.length - 1,
        Math.floor((pct / 100) * PROFILES.length)
      );
      setProfileIdx(idx);

      if (elapsed >= duration) {
        clearInterval(interval);
        setHide(true);
        setTimeout(() => onFinished(), 500); // wait for fade-out
      }
    }, 50);
    return () => clearInterval(interval);
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
      {/* Background batik sogan pekat */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #2a1810 0%, #4a2f20 25%, #6b4423 50%, #4a2f20 75%, #2a1810 100%)",
        }}
        aria-hidden
      />

      {/* Pattern batik kawung overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23c9a227' stroke-width='1' opacity='0.6'%3E%3Ccircle cx='25' cy='25' r='15'/%3E%3Cpath d='M25 10 Q19 19 25 25 Q31 19 25 10' fill='%23c9a227' fill-opacity='0.4'/%3E%3Cpath d='M10 25 Q19 19 25 25 Q19 31 10 25' fill='%23c9a227' fill-opacity='0.4'/%3E%3Cpath d='M25 40 Q19 31 25 25 Q31 31 25 40' fill='%23c9a227' fill-opacity='0.4'/%3E%3Cpath d='M40 25 Q31 19 25 25 Q31 31 40 25' fill='%23c9a227' fill-opacity='0.4'/%3E%3Ccircle cx='75' cy='75' r='15'/%3E%3Cpath d='M75 60 Q69 69 75 75 Q81 69 75 60' fill='%23c9a227' fill-opacity='0.4'/%3E%3Cpath d='M60 75 Q69 69 75 75 Q69 81 60 75' fill='%23c9a227' fill-opacity='0.4'/%3E%3Cpath d='M75 90 Q69 81 75 75 Q81 81 75 90' fill='%23c9a227' fill-opacity='0.4'/%3E%3Cpath d='M90 75 Q81 69 75 75 Q81 81 90 75' fill='%23c9a227' fill-opacity='0.4'/%3E%3Ccircle cx='75' cy='25' r='12'/%3E%3Ccircle cx='25' cy='75' r='12'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
        aria-hidden
      />

      {/* Glow emas radial */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,162,39,0.25) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      {/* Decorative corner ornaments */}
      <div className="absolute top-6 left-6 text-3xl md:text-4xl text-emas opacity-60" aria-hidden>❋</div>
      <div className="absolute top-6 right-6 text-3xl md:text-4xl text-emas opacity-60" aria-hidden>❋</div>
      <div className="absolute bottom-6 left-6 text-3xl md:text-4xl text-emas opacity-60" aria-hidden>❋</div>
      <div className="absolute bottom-6 right-6 text-3xl md:text-4xl text-emas opacity-60" aria-hidden>❋</div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-8 text-center">
        {/* Top divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-16 md:w-24 bg-emas/60" />
          <span className="text-emas text-2xl">❋</span>
          <span className="h-px w-16 md:w-24 bg-emas/60" />
        </div>

        {/* Logo kampus */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-6">
          <div className="bg-white/95 rounded-lg p-2 shadow-2xl border-2 border-emas/50">
            <img
              src="/logos/universitas-tulungagung.png"
              alt="Logo Universitas Tulungagung"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>
          <div className="bg-white/95 rounded-lg p-2 shadow-2xl border-2 border-emas/50">
            <img
              src="/logos/universitas-bhinneka-pgri.png"
              alt="Logo Universitas Bhinneka PGRI"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>
        </div>

        {/* Sambutan Sugeng Rawuh */}
        <p className="font-display text-base md:text-xl text-emas-light italic mb-2 animate-pulse">
          ❋ Sugeng Rawuh ❋
        </p>

        {/* Title VOCAL */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-emas mb-2 tracking-wide drop-shadow-lg">
          VOCAL
        </h1>
        <p className="text-xs md:text-sm text-krem/90 italic mb-6 tracking-wide font-display">
          Voice Of Cultural And Local Wisdom
        </p>

        {/* Subtitle / Tagline */}
        <div className="max-w-2xl mx-auto mb-8 space-y-2">
          <p className="text-sm md:text-base text-krem font-display leading-relaxed">
            Inovasi Pembelajaran Digital Speaking
          </p>
          <p className="text-sm md:text-base text-krem/85 font-display italic leading-relaxed">
            Berbasis Kearifan Lokal untuk Mewujudkan
          </p>
          <p className="text-base md:text-xl text-emas-light font-display font-semibold leading-relaxed">
            Kampus Berdampak
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-12 bg-emas/50" />
          <span className="text-emas">❋</span>
          <span className="h-px w-12 bg-emas/50" />
        </div>

        {/* Professor profile */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative">
            {/* Decorative ring */}
            <div className="absolute -inset-2 rounded-full border-2 border-emas/50 animate-spin-slow" />
            <div className="absolute -inset-3 rounded-full border border-emas/30" />
            {/* Photo */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-emas shadow-2xl">
              <img
                src="/logos/prof-dwi-ima.jpeg"
                alt="Foto Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Corner stars */}
            <span className="absolute -top-1 -left-1 text-emas text-lg">❋</span>
            <span className="absolute -top-1 -right-1 text-emas text-lg">❋</span>
            <span className="absolute -bottom-1 -left-1 text-emas text-lg">❋</span>
            <span className="absolute -bottom-1 -right-1 text-emas text-lg">❋</span>
          </div>

          <div className="space-y-1 mt-2">
            <p className="text-base md:text-lg font-bold text-krem font-display">
              Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum
            </p>
            <p className="text-xs md:text-sm text-emas-light italic">
              Dosen Pengampu Mata Kuliah Bahasa Inggris Bisnis (UTW2002)
            </p>
            <p className="text-[10px] md:text-xs text-krem/60">
              FISIP &middot; S1 Administrasi Publik &middot; Universitas Tulungagung
            </p>
          </div>
        </div>

        {/* Loading progress */}
        <div className="max-w-md mx-auto space-y-2">
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

      {/* Custom CSS for slow spin */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

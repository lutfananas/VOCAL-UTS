"use client";

// View: Halaman Login NIM - TEMA PUTIH DOMINAN
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Mic,
  Info,
} from "lucide-react";
import {
  BatikDivider,
  SugengRawuhBanner,
  TulungagungInfoCard,
  BatikFooter,
} from "@/components/cbt-speaking/cultural-elements";

interface LoginViewProps {
  onLoginSuccess: (student: {
    id: string;
    nim: string;
    name: string;
    programStudy: string;
    faculty: string;
    courseCode: string;
    courseName: string;
    examStatus: string;
    startedAt: string;
  }) => void;
  onAdminAccess?: () => void;
}

export function LoginView({ onLoginSuccess, onAdminAccess }: LoginViewProps) {
  const [nim, setNim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoNim, setShowDemoNim] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = nim.trim();
    if (!trimmed) {
      setError("NIM wajib diisi.");
      return;
    }
    if (!/^\d{6,12}$/.test(trimmed)) {
      setError("Format NIM tidak valid. NIM harus 6-12 digit angka.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: trimmed }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Login gagal.");
        return;
      }
      onLoginSuccess(data.student);
    } catch (err) {
      console.error(err);
      setError("Koneksi ke server gagal. Periksa internet Anda lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top batik accent strip */}
      <div className="h-2 bg-gradient-to-r from-dongker via-merah to-dongker" />

      <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Header dengan 2 Logo Kampus + Sambutan Budaya */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col items-center text-center gap-4">
            {/* Dua logo kampus - transparent PNGs */}
            <div className="flex items-center justify-center gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-1">
                <img
                  src="/logos/universitas-tulungagung.png"
                  alt="Logo Universitas Tulungagung"
                  className="h-20 md:h-24 w-auto object-contain drop-shadow-md"
                />
                <span className="text-[10px] md:text-xs text-dongker font-semibold">
                  Universitas Tulungagung
                </span>
              </div>
              <div className="hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
              <div className="flex flex-col items-center gap-1">
                <img
                  src="/logos/universitas-bhinneka-pgri.png"
                  alt="Logo Universitas Bhinneka PGRI"
                  className="h-20 md:h-24 w-auto object-contain drop-shadow-md"
                />
                <span className="text-[10px] md:text-xs text-dongker font-semibold">
                  Universitas Bhinneka PGRI
                </span>
              </div>
            </div>

            {/* Cultural welcome banner */}
            <SugengRawuhBanner />

            {/* Hero header - clean dongker gradient only for header */}
            <div className="batik-hero rounded-xl px-6 py-5 shadow-md w-full max-w-3xl relative overflow-hidden">
              <div className="absolute top-2 left-3 text-white/60 text-xl">❋</div>
              <div className="absolute top-2 right-3 text-white/60 text-xl">❋</div>
              <div className="flex items-center justify-center gap-3">
                <div className="rounded-xl bg-white/15 p-2.5 border border-white/30">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                    UJIAN SPEAKING CBT
                  </h1>
                  <p className="text-xs md:text-sm text-white/85 italic font-display">
                    Bahasa Inggris Bisnis &middot; UTW2002
                  </p>
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className="bg-white border-dongker text-dongker-dark font-semibold"
            >
              ❋ Tahun Akademik 2025/2026 ❋
            </Badge>
          </div>
        </header>

        <BatikDivider />

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start mt-6">
          {/* Left: Info Card + Cultural Info */}
          <aside className="lg:col-span-2 space-y-4">
            <Card className="border-slate-200 shadow-sm paper-texture batik-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-dongker-dark font-display">
                  <Info className="h-4 w-4 text-merah" />
                  Informasi Ujian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 text-slate-500">Mata Kuliah</div>
                  <div className="col-span-2 font-medium text-slate-800">
                    Bahasa Inggris Bisnis (UTW2002)
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 text-slate-500">Program Studi</div>
                  <div className="col-span-2 font-medium text-slate-800">
                    S1 Administrasi Publik
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 text-slate-500">Fakultas</div>
                  <div className="col-span-2 font-medium text-slate-800">FISIP</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 text-slate-500">Dosen Penguji</div>
                  <div className="col-span-2 font-medium text-slate-800">
                    Prof. Dr. Dwi Ima H, M.Hum
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 text-slate-500">Total Soal</div>
                  <div className="col-span-2 font-medium text-slate-800">
                    6 Section &middot; 100 Poin
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 text-slate-500">Durasi</div>
                  <div className="col-span-2 font-medium text-slate-800">
                    ~ 35 Menit
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800 font-display">
                  <Mic className="h-4 w-4" />
                  Persiapan Teknis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-amber-900/90">
                <p className="flex gap-2">
                  <span className="font-bold text-amber-700">1.</span>
                  <span>Gunakan headset/mikrofon yang berfungsi baik.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-amber-700">2.</span>
                  <span>
                    Pastikan berada di ruangan tenang, pencahayaan cukup, dan
                    koneksi internet stabil.
                  </span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-amber-700">3.</span>
                  <span>
                    Gunakan browser Chrome / Edge / Firefox terbaru. Hindari
                    Safari.
                  </span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-amber-700">4.</span>
                  <span>
                    Izinkan akses mikrofon saat browser meminta izin.
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Cultural info card - Tulungagung */}
            <TulungagungInfoCard />
          </aside>

          {/* Right: Login Form */}
          <main className="lg:col-span-3">
            <Card className="border-slate-200 shadow-md paper-texture batik-card">
              <CardHeader className="space-y-2 pt-6">
                <div className="flex items-center gap-2 text-merah">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Login Peserta
                  </span>
                </div>
                <CardTitle className="text-2xl md:text-3xl text-dongker-dark font-display">
                  Masuk dengan NIM Terdaftar
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Hanya NIM mahasiswa yang sudah terdaftar di sistem dapat
                  mengikuti ujian. Silakan masukkan NIM Anda dengan benar.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nim" className="text-dongker-dark font-medium">
                      Nomor Induk Mahasiswa (NIM)
                    </Label>
                    <Input
                      id="nim"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6,12}"
                      autoComplete="off"
                      placeholder="Contoh: 220100101"
                      value={nim}
                      onChange={(e) =>
                        setNim(e.target.value.replace(/\D/g, "").slice(0, 12))
                      }
                      className="text-lg tracking-wider font-mono h-12 border-slate-300 bg-white focus:border-dongker focus:ring-dongker/20"
                      disabled={loading}
                      maxLength={12}
                    />
                    <p className="text-xs text-slate-500">
                      NIM harus terdiri dari 6-12 digit angka tanpa spasi.
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Login Gagal</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    <p className="font-medium text-slate-700 mb-1">
                      Catatan Keamanan:
                    </p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>
                        Sistem akan merekam aktivitas login dan pengerjaan
                        ujian.
                      </li>
                      <li>
                        Jangan tutup browser atau refresh halaman selama ujian.
                      </li>
                      <li>
                        Setelah submit, Anda tidak dapat login ulang atau
                        mengubah jawaban.
                      </li>
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={loading || !nim}
                    className="w-full h-12 text-base font-semibold btn-batik"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Memverifikasi NIM...
                      </>
                    ) : (
                      <>Masuk &amp; Mulai Ujian</>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowDemoNim((v) => !v)}
                    className="text-xs text-slate-500 hover:text-dongker underline-offset-2 hover:underline"
                  >
                    {showDemoNim ? "Sembunyikan" : "Lihat"} NIM contoh untuk testing
                  </button>

                  {showDemoNim && (
                    <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
                      <p className="font-semibold text-dongker-dark mb-2">
                        NIM contoh (database seed):
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-slate-600">
                        <span>220100101 - Ahmad Fauzi</span>
                        <span>220100102 - Siti Nurhaliza</span>
                        <span>220100103 - Budi Santoso</span>
                        <span>220100104 - Dewi Lestari</span>
                        <span>220100105 - Rizki Pratama</span>
                        <span>220100106 - Nabila Az-Zahra</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Total 25 NIM terdaftar (220100101 - 220100125).
                      </p>
                    </div>
                  )}
                </CardFooter>
              </form>
            </Card>
          </main>
        </div>

        <BatikFooter />

        {/* Admin access - subtle link at bottom */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => onAdminAccess?.()}
            className="text-[10px] text-slate-400 hover:text-dongker transition-colors inline-flex items-center gap-1"
          >
            <ShieldCheck className="h-3 w-3" />
            Akses Panel Dosen / Admin
          </button>
        </div>
      </div>
    </div>
  );
}

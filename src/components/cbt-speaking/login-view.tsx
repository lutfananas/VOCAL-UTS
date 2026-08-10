"use client";

// View: Halaman Login NIM
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
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-600 p-3 shadow-lg shadow-emerald-600/20">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                  UJIAN SPEAKING CBT
                </h1>
                <p className="text-xs md:text-sm text-slate-500">
                  Bahasa Inggris Bisnis &middot; UTW2002
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-white/70 backdrop-blur border-emerald-200 text-emerald-700"
            >
              Tahun Akademik 2025/2026
            </Badge>
          </div>
        </header>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Left: Info Card */}
          <aside className="lg:col-span-2 space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                  <Info className="h-4 w-4 text-emerald-600" />
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

            <Card className="border-amber-200 bg-amber-50/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                  <Mic className="h-4 w-4" />
                  Persiapan Teknis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-amber-900/90">
                <p className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Gunakan headset/mikrofon yang berfungsi baik.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>
                    Pastikan berada di ruangan tenang, pencahayaan cukup, dan
                    koneksi internet stabil.
                  </span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>
                    Gunakan browser Chrome / Edge / Firefox terbaru. Hindari
                    Safari.
                  </span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>
                    Izinkan akses mikrofon saat browser meminta izin.
                  </span>
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Right: Login Form */}
          <main className="lg:col-span-3">
            <Card className="border-slate-200 shadow-md">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Login Peserta
                  </span>
                </div>
                <CardTitle className="text-2xl md:text-3xl text-slate-900">
                  Masuk dengan NIM Terdaftar
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Hanya NIM mahasiswa yang sudah terdaftar di sistem dapat
                  mengikuti ujian. Silakan masukkan NIM Anda dengan benar.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nim" className="text-slate-700">
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
                      className="text-lg tracking-wider font-mono h-12 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
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

                  <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600">
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
                    className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
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
                    className="text-xs text-slate-500 hover:text-slate-700 underline-offset-2 hover:underline"
                  >
                    {showDemoNim ? "Sembunyikan" : "Lihat"} NIM contoh untuk testing
                  </button>

                  {showDemoNim && (
                    <div className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs space-y-1">
                      <p className="font-semibold text-slate-700 mb-2">
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

        <footer className="mt-10 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} FISIP &middot; Sistem CBT Speaking
          Examination
        </footer>
      </div>
    </div>
  );
}

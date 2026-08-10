"use client";

// View: Halaman Sukses Submit
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Clock, Award, LogOut, Mail } from "lucide-react";

interface SubmitSuccessViewProps {
  student: {
    nim: string;
    name: string;
  };
  submittedAt: string;
  summary: {
    totalQuestions: number;
    totalDurationSeconds: number;
    answers: {
      questionId: string;
      durationSeconds: number;
      attemptCount: number;
    }[];
  };
  onLogout: () => void;
}

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m ${s}s`;
}

export function SubmitSuccessView({
  student,
  submittedAt,
  summary,
  onLogout,
}: SubmitSuccessViewProps) {
  const submittedDate = new Date(submittedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo Kampus */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
          <div className="flex flex-col items-center gap-1">
            <img
              src="/logos/universitas-tulungagung.png"
              alt="Logo Universitas Tulungagung"
              className="h-14 md:h-16 w-auto object-contain"
            />
            <span className="text-[10px] text-slate-500 font-medium">
              Universitas Tulungagung
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <img
              src="/logos/universitas-bhinneka-pgri.png"
              alt="Logo Universitas Bhinneka PGRI"
              className="h-14 md:h-16 w-auto object-contain"
            />
            <span className="text-[10px] text-slate-500 font-medium">
              Universitas Bhinneka PGRI
            </span>
          </div>
        </div>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 rounded-full bg-emerald-100 p-4 w-fit">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-slate-900">
              Ujian Berhasil Disubmit
            </CardTitle>
            <CardDescription className="text-slate-600">
              Terima kasih, jawaban speaking Anda telah berhasil tersimpan di
              sistem.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Receipt */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500">Nama Peserta</div>
                <div className="font-semibold text-slate-800 text-right">
                  {student.name}
                </div>
                <div className="text-slate-500">NIM</div>
                <div className="font-mono font-semibold text-slate-800 text-right">
                  {student.nim}
                </div>
                <div className="text-slate-500">Waktu Submit</div>
                <div className="font-semibold text-slate-800 text-right">
                  {submittedDate.toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "medium",
                  })}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-1">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Total Soal
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-800">
                  {summary.totalQuestions}
                </p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Total Durasi Audio
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {fmtDuration(summary.totalDurationSeconds)}
                </p>
              </div>
            </div>

            {/* Detail per soal */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Detail Jawaban per Section
              </h3>
              <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                {summary.answers.map((a) => (
                  <div
                    key={a.questionId}
                    className="flex items-center justify-between p-3 text-sm"
                  >
                    <span className="font-mono text-slate-700">
                      {a.questionId}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">
                        {a.attemptCount} percobaan
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        {fmtDuration(a.durationSeconds)}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>Penting:</strong> Hasil dan nilai akan diumumkan oleh
                dosen pengampu (Prof. Dr. Dwi Ima H, M.Hum) setelah seluruh
                jawaban dinilai. Jika ada kendala teknis selama ujian, segera
                laporkan via email dosen.
              </p>
            </div>

            <Button
              onClick={onLogout}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout &amp; Selesai
            </Button>

            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
              <Mail className="h-3 w-3" />
              Simpan informasi sesi ini sebagai bukti penyelesaian ujian.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

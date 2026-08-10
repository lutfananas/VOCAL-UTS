"use client";

// View: Halaman Sukses Submit - Tema Budaya Tulungagung
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Clock, Award, LogOut, Mail } from "lucide-react";
import { BatikDivider, SugengRawuhBanner } from "@/components/cbt-speaking/cultural-elements";

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
    <div className="min-h-screen batik-kawung flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo Kampus + Welcome */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white rounded-lg p-1.5 shadow-md border border-emas/40">
                <img
                  src="/logos/universitas-tulungagung.png"
                  alt="Logo Universitas Tulungagung"
                  className="h-14 md:h-16 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] text-sogan font-semibold">
                Universitas Tulungagung
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white rounded-lg p-1.5 shadow-md border border-emas/40">
                <img
                  src="/logos/universitas-bhinneka-pgri.png"
                  alt="Logo Universitas Bhinneka PGRI"
                  className="h-14 md:h-16 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] text-sogan font-semibold">
                Universitas Bhinneka PGRI
              </span>
            </div>
          </div>
          <SugengRawuhBanner />
        </div>

        <Card className="border-emas/50 shadow-lg paper-texture batik-card">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 rounded-full bg-emas/15 p-4 w-fit border border-emas/30">
              <CheckCircle2 className="h-12 w-12 text-emas" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-sogan-dark font-display">
              Matur Suwun, Ujian Berhasil Disubmit
            </CardTitle>
            <CardDescription className="text-muted-foreground italic font-display">
              Terima kasih, jawaban speaking Anda telah berhasil tersimpan di
              sistem.
            </CardDescription>
            <BatikDivider className="max-w-xs mx-auto" />
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Receipt */}
            <div className="rounded-lg border border-emas/40 bg-krem-warm/60 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Nama Peserta</div>
                <div className="font-semibold text-sogan-dark text-right">
                  {student.name}
                </div>
                <div className="text-muted-foreground">NIM</div>
                <div className="font-mono font-semibold text-sogan-dark text-right">
                  {student.nim}
                </div>
                <div className="text-muted-foreground">Waktu Submit</div>
                <div className="font-semibold text-sogan-dark text-right">
                  {submittedDate.toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "medium",
                  })}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emas/40 bg-emas/5 p-4 batik-card">
                <div className="flex items-center gap-2 text-sogan-dark mb-1">
                  <Award className="h-4 w-4 text-emas" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Total Soal
                  </span>
                </div>
                <p className="text-2xl font-bold text-sogan-dark font-display">
                  {summary.totalQuestions}
                </p>
              </div>
              <div className="rounded-lg border border-mendon/40 bg-mendon/5 p-4 batik-card">
                <div className="flex items-center gap-2 text-mendon mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Total Durasi Audio
                  </span>
                </div>
                <p className="text-2xl font-bold text-mendon font-display">
                  {fmtDuration(summary.totalDurationSeconds)}
                </p>
              </div>
            </div>

            {/* Detail per soal */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-sogan-dark mb-2 font-display">
                ❋ Detail Jawaban per Section ❋
              </h3>
              <div className="rounded-lg border border-sogan/30 divide-y divide-sogan/15 bg-krem-warm/40">
                {summary.answers.map((a) => (
                  <div
                    key={a.questionId}
                    className="flex items-center justify-between p-3 text-sm"
                  >
                    <span className="font-mono text-sogan-dark">
                      {a.questionId}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        {a.attemptCount} percobaan
                      </span>
                      <span className="font-mono font-semibold text-sogan-dark">
                        {fmtDuration(a.durationSeconds)}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emas" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="rounded-lg border border-emas/40 bg-emas/5 p-4">
              <p className="text-sm text-sogan-dark leading-relaxed">
                <strong className="text-sogan-dark">Penting:</strong> Hasil dan
                nilai akan diumumkan oleh dosen pengampu (Prof. Dr. Dwi Ima H,
                M.Hum) setelah seluruh jawaban dinilai. Jika ada kendala teknis
                selama ujian, segera laporkan via email dosen.
              </p>
            </div>

            <Button
              onClick={onLogout}
              className="w-full h-12 btn-batik border-emas"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout &amp; Selesai
            </Button>

            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1 italic font-display">
              <Mail className="h-3 w-3" />
              Simpan informasi sesi ini sebagai bukti penyelesaian ujian.
            </p>

            <BatikDivider />

            <p className="text-center text-xs text-sogan-dark italic font-display">
              &ldquo;Matur nuwun sampun ngrampungaken ujian kanthi temen&rdquo;
            </p>
            <p className="text-center text-[10px] text-muted-foreground">
              &ldquo;Terima kasih telah menyelesaikan ujian dengan sungguh-sungguh&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

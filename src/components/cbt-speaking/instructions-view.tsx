"use client";

// View: Halaman Instruksi & Overview Ujian (sebelum mulai)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Clock,
  Mic,
  AlertTriangle,
  PlayCircle,
  LogOut,
  Volume2,
  ListChecks,
} from "lucide-react";
import { EXAM_META, SPEAKING_QUESTIONS } from "@/lib/questions";

interface InstructionsViewProps {
  student: {
    nim: string;
    name: string;
    programStudy: string;
    faculty: string;
    courseName: string;
  };
  onStart: () => void;
  onLogout: () => void;
  // resume info
  answeredQuestionIds: string[];
  startedAt: string | null;
}

export function InstructionsView({
  student,
  onStart,
  onLogout,
  answeredQuestionIds,
  startedAt,
}: InstructionsViewProps) {
  const [confirmed, setConfirmed] = useState(false);
  const isResume = answeredQuestionIds.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-emerald-600 p-2 shadow-sm">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">
                {student.faculty} &middot; {student.programStudy}
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate">
                {student.name}{" "}
                <span className="text-slate-400 font-normal">
                  ({student.nim})
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-slate-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2">
          <Badge
            variant="outline"
            className="bg-emerald-50 border-emerald-200 text-emerald-700"
          >
            {EXAM_META.title}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {EXAM_META.courseName} ({EXAM_META.courseCode})
          </h1>
          <p className="text-sm text-slate-500">
            Tahun Akademik {EXAM_META.academicYear} &middot; Dosen Penguji:{" "}
            {EXAM_META.examiner}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2">
                  <ListChecks className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Section</p>
                  <p className="text-xl font-bold text-slate-800">
                    {EXAM_META.totalQuestions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Durasi ~</p>
                  <p className="text-xl font-bold text-slate-800">
                    {EXAM_META.totalDurationMin} mnt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Poin</p>
                  <p className="text-xl font-bold text-slate-800">
                    {EXAM_META.totalPoints}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-50 p-2">
                  <Volume2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Format</p>
                  <p className="text-xl font-bold text-slate-800">Audio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isResume && (
          <Card className="border-blue-200 bg-blue-50/60">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2 shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-blue-900">
                  Melanjutkan Sesi Ujian
                </p>
                <p className="text-sm text-blue-800/80">
                  Anda sudah menjawab {answeredQuestionIds.length} dari{" "}
                  {EXAM_META.totalQuestions} soal. Anda dapat melanjutkan dari
                  soal yang belum dijawab atau memperbaiki jawaban yang sudah
                  ada (maksimal 3 percobaan per soal).
                </p>
                <Progress
                  value={
                    (answeredQuestionIds.length / EXAM_META.totalQuestions) * 100
                  }
                  className="h-2 mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Petunjuk Umum */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <PlayCircle className="h-5 w-5 text-emerald-600" />
              Petunjuk Umum
            </CardTitle>
            <CardDescription>
              Baca seluruh petunjuk berikut dengan saksama sebelum memulai
              ujian.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 rounded-lg border bg-slate-50/50 p-4">
              <ol className="space-y-3 text-sm text-slate-700">
                {EXAM_META.instructions.map((ins, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{ins}</span>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Daftar Soal */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <ListChecks className="h-5 w-5 text-emerald-600" />
              Daftar Section Ujian
            </CardTitle>
            <CardDescription>
              Enam section berikut akan dikerjakan secara berurutan. Setiap
              section memiliki alokasi waktu dan kriteria penilaian yang
              berbeda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SPEAKING_QUESTIONS.map((q) => {
              const answered = answeredQuestionIds.includes(q.id);
              return (
                <div
                  key={q.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    answered
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                          answered ? "bg-emerald-600" : "bg-slate-400"
                        }`}
                      >
                        {q.sectionNumber}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono text-slate-500">
                            {q.id}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-slate-100 text-slate-700"
                          >
                            {q.type.replace(/_/g, " ")}
                          </Badge>
                          {answered && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-emerald-50 border-emerald-300 text-emerald-700"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Sudah dijawab
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm leading-snug">
                          {q.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {q.scenario}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Prep {q.preparationTimeSec}s + Rekam{" "}
                            {q.recordingTimeSec}s
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {q.points} poin
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Persetujuan & Mulai */}
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="p-5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700 leading-relaxed">
                Saya telah membaca dan memahami seluruh petunjuk ujian. Saya
                menyatakan bahwa jawaban yang akan saya rekam adalah murni hasil
                kerja sendiri tanpa bantuan pihak lain atau alat terlarang. Saya
                juga memahami bahwa setelah menekan tombol{" "}
                <span className="font-semibold">Submit</span>, jawaban tidak
                dapat diubah.
              </span>
            </label>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-slate-300"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout &amp; Batalkan
              </Button>
              <Button
                disabled={!confirmed}
                onClick={onStart}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                size="lg"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                {isResume ? "Lanjutkan Ujian" : "Mulai Ujian Speaking"}
              </Button>
            </div>
            {!confirmed && (
              <p className="text-xs text-slate-500 text-center">
                Centang kotak persetujuan di atas untuk mengaktifkan tombol
                mulai.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

// View: Halaman Instruksi & Overview Ujian - Tema Budaya Tulungagung
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
import {
  BatikDivider,
  SugengRawuhBanner,
  TulungagungInfoCard,
  BatikFooter,
  SectionHeader,
} from "@/components/cbt-speaking/cultural-elements";

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
    <div className="min-h-screen batik-mega">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-emas/30 bg-krem-warm/95 backdrop-blur shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg btn-batik p-2 shadow-sm">
              <Mic className="h-4 w-4 text-krem" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                {student.faculty} &middot; {student.programStudy}
              </p>
              <p className="text-sm font-semibold text-dongker-dark truncate">
                {student.name}{" "}
                <span className="text-muted-foreground font-normal">
                  ({student.nim})
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-dongker hover:text-merah hover:bg-merah/5"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10 space-y-6">
        {/* Logo Kampus + Welcome */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="flex flex-col items-center gap-1">
              <img
                  src="/logos/universitas-tulungagung.png"
                  alt="Logo Universitas Tulungagung"
                  className="h-16 md:h-20 w-auto object-contain drop-shadow-lg"
                />
              <span className="text-[10px] md:text-xs text-dongker font-semibold">
                Universitas Tulungagung
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img
                  src="/logos/universitas-bhinneka-pgri.png"
                  alt="Logo Universitas Bhinneka PGRI"
                  className="h-16 md:h-20 w-auto object-contain drop-shadow-lg"
                />
              <span className="text-[10px] md:text-xs text-dongker font-semibold">
                Universitas Bhinneka PGRI
              </span>
            </div>
          </div>
          <SugengRawuhBanner />
        </div>

        {/* Hero */}
        <div className="text-center space-y-3">
          <Badge
            variant="outline"
            className="bg-krem-warm border-emas text-dongker-dark font-semibold"
          >
            ❋ {EXAM_META.title} ❋
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-dongker-dark font-display">
            {EXAM_META.courseName} ({EXAM_META.courseCode})
          </h1>
          <p className="text-sm text-muted-foreground italic font-display">
            Tahun Akademik {EXAM_META.academicYear} &middot; Dosen Penguji:{" "}
            {EXAM_META.examiner}
          </p>
          <BatikDivider className="max-w-md mx-auto" />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-dongker/30 paper-texture batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-dongker/15 p-2">
                  <ListChecks className="h-5 w-5 text-dongker" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Section</p>
                  <p className="text-xl font-bold text-dongker-dark font-display">
                    {EXAM_META.totalQuestions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dongker/30 paper-texture batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emas/15 p-2">
                  <Clock className="h-5 w-5 text-emas" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Durasi ~</p>
                  <p className="text-xl font-bold text-dongker-dark font-display">
                    {EXAM_META.totalDurationMin} mnt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dongker/30 paper-texture batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-dongker/15 p-2">
                  <CheckCircle2 className="h-5 w-5 text-dongker" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Poin</p>
                  <p className="text-xl font-bold text-dongker-dark font-display">
                    {EXAM_META.totalPoints}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dongker/30 paper-texture batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-merah/15 p-2">
                  <Volume2 className="h-5 w-5 text-merah" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Format</p>
                  <p className="text-xl font-bold text-dongker-dark font-display">
                    Audio
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isResume && (
          <Card className="border-dongker/30 bg-dongker/5">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="rounded-lg bg-dongker/15 p-2 shrink-0">
                <AlertTriangle className="h-5 w-5 text-dongker" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-dongker">
                  Melanjutkan Sesi Ujian
                </p>
                <p className="text-sm text-dongker-dark/80">
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
        <Card className="border-dongker/30 shadow-sm paper-texture batik-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-dongker-dark font-display">
              <PlayCircle className="h-5 w-5 text-emas" />
              Petunjuk Umum
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Bacalah seluruh petunjuk berikut dengan saksama sebelum memulai
              ujian.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 rounded-lg border border-emas/30 bg-krem-warm/60 p-4 batik-scroll">
              <ol className="space-y-3 text-sm text-dongker-dark">
                {EXAM_META.instructions.map((ins, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-dongker text-krem text-xs font-bold flex items-center justify-center font-display">
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
        <Card className="border-dongker/30 shadow-sm paper-texture batik-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-dongker-dark font-display">
              <ListChecks className="h-5 w-5 text-emas" />
              Daftar Section Ujian
            </CardTitle>
            <CardDescription className="text-muted-foreground">
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
                      ? "border-emas/60 bg-emas/5"
                      : "border-dongker/30 bg-krem-warm/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-krem font-bold font-display ${
                          answered
                            ? "btn-batik border-emas"
                            : "bg-dongker/70 border border-dongker"
                        }`}
                      >
                        {q.sectionNumber}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {q.id}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-krem text-dongker-dark border border-dongker/30"
                          >
                            {q.type.replace(/_/g, " ")}
                          </Badge>
                          {answered && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-emas/10 border-emas text-dongker-dark"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Sudah dijawab
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-dongker-dark text-sm leading-snug font-display">
                          {q.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {q.scenario}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Prep {q.preparationTimeSec}s + Rekam{" "}
                            {q.recordingTimeSec}s
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emas" />
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

        {/* Cultural info card */}
        <TulungagungInfoCard />

        {/* Persetujuan & Mulai */}
        <Card className="border-emas/50 bg-gradient-to-br from-krem-warm to-krem shadow-md batik-card">
          <CardContent className="p-5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-dongker text-emas focus:ring-emas/30"
              />
              <span className="text-sm text-dongker-dark leading-relaxed">
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
                className="border-dongker/40 text-dongker hover:bg-dongker/5"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout &amp; Batalkan
              </Button>
              <Button
                disabled={!confirmed}
                onClick={onStart}
                className="btn-batik border-emas"
                size="lg"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                {isResume ? "Lanjutkan Ujian" : "Mulai Ujian Speaking"}
              </Button>
            </div>
            {!confirmed && (
              <p className="text-xs text-muted-foreground text-center">
                Centang kotak persetujuan di atas untuk mengaktifkan tombol
                mulai.
              </p>
            )}
          </CardContent>
        </Card>

        <BatikFooter />
      </div>
    </div>
  );
}

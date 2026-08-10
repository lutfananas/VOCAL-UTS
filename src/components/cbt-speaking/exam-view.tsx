"use client";

// View: Halaman Pengerjaan Ujian Speaking
// - Menampilkan soal per section
// - Countdown preparation time
// - Audio recorder (MediaRecorder API)
// - Submit per soal
// - Navigation antar section
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Mic,
  MicOff,
  Play,
  Square,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Eye,
  EyeOff,
  Lightbulb,
  Volume2,
  VolumeX,
  Timer,
} from "lucide-react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { SPEAKING_QUESTIONS, EXAM_META } from "@/lib/questions";

export interface ExamQuestionClient {
  id: string;
  sectionNumber: number;
  sectionTitle: string;
  type: string;
  title: string;
  scenario: string;
  instruction: string;
  preparationTimeSec: number;
  recordingTimeSec: number;
  minDurationSec: number;
  points: number;
  evaluationCriteria: string[];
  tips: string[];
  readingText?: string;
  promptText?: string;
  informalSentences?: string[];
  guidingQuestions?: string[];
  answered: boolean;
  answerMeta: {
    durationSeconds: number;
    attemptCount: number;
    recordedAt: string;
  } | null;
}

interface ExamViewProps {
  student: {
    nim: string;
    name: string;
  };
  questions: ExamQuestionClient[];
  onSubmitExam: () => void;
  onLogout: () => void;
  onAnswerSaved: (
    questionId: string,
    meta: { durationSeconds: number; attemptCount: number }
  ) => void;
}

type Phase = "preparing" | "ready-to-record" | "recording" | "recorded" | "submitting";

function fmtTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function ExamView({
  student,
  questions,
  onSubmitExam,
  onLogout,
  onAnswerSaved,
}: ExamViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("preparing");
  const [prepRemaining, setPrepRemaining] = useState<number>(
    questions[0]?.preparationTimeSec ?? 0
  );
  const [recRemaining, setRecRemaining] = useState<number>(
    questions[0]?.recordingTimeSec ?? 0
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [savedJustNow, setSavedJustNow] = useState<string | null>(null);

  const question = questions[currentIndex];

  const recorder = useAudioRecorder();

  const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derived phase: recorder.status takes precedence over local phase
  // when recorder is actively recording or has finished recording.
  const effectivePhase: Phase =
    recorder.status === "recording" || recorder.status === "stopping"
      ? "recording"
      : recorder.status === "stopped" && phase !== "submitting"
      ? "recorded"
      : phase;

  // Cleanup timers on unmount only
  useEffect(() => {
    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    };
  }, []);

  // Start prep countdown for the FIRST question on mount only.
  // setState calls inside the interval callback are async, not synchronous
  // in the effect body, so they don't trigger the set-state-in-effect rule.
  useEffect(() => {
    const firstQ = questions[0];
    if (!firstQ) return;
    prepTimerRef.current = setInterval(() => {
      setPrepRemaining((prev) => {
        if (prev <= 1) {
          if (prepTimerRef.current) clearInterval(prepTimerRef.current);
          setPhase("ready-to-record");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Reset per-question state and start the preparation countdown timer.
  // Called from navigation handler (not from useEffect) to avoid setState-in-effect.
  const resetPerQuestionState = useCallback((q: ExamQuestionClient) => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    setPhase("preparing");
    setPrepRemaining(q.preparationTimeSec);
    setRecRemaining(q.recordingTimeSec);
    setSubmitError(null);
    setShowTips(false);
    setSavedJustNow(null);

    // Start the prep countdown
    prepTimerRef.current = setInterval(() => {
      setPrepRemaining((prev) => {
        if (prev <= 1) {
          if (prepTimerRef.current) clearInterval(prepTimerRef.current);
          setPhase("ready-to-record");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const skipPreparation = () => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    setPrepRemaining(0);
    setPhase("ready-to-record");
  };

  // Mulai rekam
  const handleStartRecording = async () => {
    setSubmitError(null);
    setRecRemaining(question.recordingTimeSec);
    await recorder.start();
    // Mulai countdown rekaman
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    recTimerRef.current = setInterval(() => {
      setRecRemaining((prev) => {
        if (prev <= 1) {
          if (recTimerRef.current) clearInterval(recTimerRef.current);
          // Auto-stop
          recorder.stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop rekam
  const handleStopRecording = async () => {
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    await recorder.stop();
  };

  // Re-record
  const handleRerecord = () => {
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    recorder.reset();
    setPhase("ready-to-record");
    setRecRemaining(question.recordingTimeSec);
  };

  // Submit jawaban ke server
  const handleSubmitAnswer = async () => {
    if (!recorder.audioBase64) {
      setSubmitError("Belum ada rekaman untuk disimpan.");
      return;
    }
    setPhase("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          audioData: recorder.audioBase64,
          durationSeconds: recorder.durationSec,
          mimeType: recorder.audioMimeType,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setSubmitError(data.error || "Gagal menyimpan jawaban.");
        setPhase("recorded");
        return;
      }
      setSavedJustNow(question.id);
      onAnswerSaved(question.id, {
        durationSeconds: data.answer.durationSeconds,
        attemptCount: data.answer.attemptCount,
      });
      // Auto-advance setelah 1.2s
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          const nextIdx = currentIndex + 1;
          const nextQ = questions[nextIdx];
          recorder.reset();
          setCurrentIndex(nextIdx);
          resetPerQuestionState(nextQ);
        } else {
          // Last question - show submit dialog
          setShowSubmitDialog(true);
          setPhase("recorded");
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setSubmitError("Koneksi gagal. Coba lagi.");
      setPhase("recorded");
    }
  };

  // Navigation
  const goToQuestion = (idx: number) => {
    if (idx < 0 || idx >= questions.length) return;
    if (idx === currentIndex) return;
    const targetQ = questions[idx];
    recorder.reset();
    setCurrentIndex(idx);
    resetPerQuestionState(targetQ);
  };

  const answeredCount = useMemo(
    () => questions.filter((q) => q.answered).length,
    [questions]
  );
  const progressPct = (answeredCount / questions.length) * 100;

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Tidak ada soal tersedia.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen batik-mega">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-emas/30 bg-krem-warm/95 backdrop-blur shadow-sm">
        <div className="container mx-auto max-w-6xl px-3 md:px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Logo kecil kampus di header */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <img
                  src="/logos/universitas-tulungagung.png"
                  alt="Universitas Tulungagung"
                  className="h-8 w-auto object-contain"
                />
                <img
                  src="/logos/universitas-bhinneka-pgri.png"
                  alt="Universitas Bhinneka PGRI"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="rounded-lg btn-batik border-emas p-2 shadow-sm shrink-0">
                <Mic className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-xs text-muted-foreground truncate">
                  {student.nim}
                </p>
                <p className="text-sm font-semibold text-dongker-dark truncate">
                  {student.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emas/10 border-emas/50 text-dongker-dark"
              >
                {answeredCount}/{questions.length} terjawab
              </Badge>
              <Button
                size="sm"
                onClick={() => setShowSubmitDialog(true)}
                disabled={answeredCount < questions.length}
                className="btn-batik border-emas hover:opacity-90 text-white"
              >
                <Send className="h-4 w-4 mr-1" />
                Submit
              </Button>
            </div>
          </div>
          <Progress value={progressPct} className="h-1 mt-2" />
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-3 md:px-4 py-4 md:py-6 grid lg:grid-cols-4 gap-4">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <Card className="border-dongker/25 sticky top-24 paper-texture batik-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-dongker">
                Navigasi Soal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {questions.map((q, idx) => {
                const isActive = idx === currentIndex;
                const isAnswered = q.answered || savedJustNow === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-full text-left rounded-lg border p-2.5 transition-all ${
                      isActive
                        ? "border-emas bg-emas/10 ring-1 ring-emas/30"
                        : isAnswered
                        ? "border-emas/40 bg-krem-warm hover:bg-emas/10/30"
                        : "border-dongker/25 bg-krem-warm hover:bg-krem-warm/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? "btn-batik border-emas text-white"
                            : isAnswered
                            ? "bg-emas/15 text-dongker-dark"
                            : "batik-mega text-muted-foreground"
                        }`}
                      >
                        {q.sectionNumber}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-dongker truncate">
                          {q.id} &middot; {q.points} pts
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {q.sectionTitle}
                        </p>
                      </div>
                      {isAnswered && (
                        <CheckCircle2 className="h-4 w-4 text-emas shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
              <div className="pt-3 mt-3 border-t border-dongker/25">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={answeredCount < questions.length}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Submit Ujian
                </Button>
                {answeredCount < questions.length && (
                  <p className="text-[10px] text-muted-foreground mt-1 text-center">
                    Jawab semua soal untuk mengaktifkan submit.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content: Question + Recorder */}
        <main className="lg:col-span-3 order-1 lg:order-2 space-y-4">
          {/* Question Header */}
          <Card className="border-dongker/25 paper-texture batik-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="bg-emas/10 border-emas/50 text-dongker-dark"
                    >
                      Section {question.sectionNumber} dari {questions.length}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="batik-mega text-dongker text-[10px]"
                    >
                      {question.type.replace(/_/g, " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-emas/10 border-emas/50 text-dongker-dark"
                    >
                      {question.points} Poin
                    </Badge>
                    {question.answered && (
                      <Badge
                        variant="outline"
                        className="bg-emas/10 border-emas/50 text-dongker-dark"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Sudah dijawab
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg md:text-xl text-dongker-dark leading-snug font-display">
                    {question.title}
                  </CardTitle>
                  <CardDescription className="text-dongker-dark/75 text-sm">
                    {question.sectionTitle}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Scenario & Instruction */}
          <Card className="border-dongker/25 paper-texture batik-card">
            <CardContent className="p-4 md:p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Skenario
                </h3>
                <p className="text-sm text-dongker leading-relaxed bg-krem-warm/60/60 rounded-lg p-3 border border-slate-100">
                  {question.scenario}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Instruksi
                </h3>
                <p className="text-sm text-dongker leading-relaxed">
                  {question.instruction}
                </p>
              </div>

              {/* Reading text for READ_ALOUD */}
              {question.readingText && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-dongker-dark mb-1.5 flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    Teks untuk Dibaca
                  </h3>
                  <div className="rounded-lg border border-emas/40 bg-emas/10/40 p-4">
                    <ScrollArea className="max-h-60">
                      <p className="text-sm text-dongker-dark leading-relaxed font-serif italic">
                        &ldquo;{question.readingText}&rdquo;
                      </p>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {/* Prompt text for ROLE_PLAY / SPOKEN_RESPONSE / OPINION_SPEAKING */}
              {question.promptText && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-merah mb-1.5 flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    Prompt (Apa yang Dikatakan Lawan Bicara)
                  </h3>
                  <div className="rounded-lg border border-merah/40 bg-merah/5 p-4">
                    <p className="text-sm text-dongker-dark leading-relaxed font-medium">
                      {question.promptText}
                    </p>
                  </div>
                </div>
              )}

              {/* Informal sentences for FORMAL_REGISTER */}
              {question.informalSentences &&
                question.informalSentences.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-dongker-dark mb-1.5">
                      Kalimat Informal (untuk Diubah ke Formal)
                    </h3>
                    <ol className="space-y-2">
                      {question.informalSentences.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm bg-emas/10/40 border border-emas/40 rounded-lg p-3"
                        >
                          <span className="shrink-0 w-5 h-5 rounded-full bg-emas/30 text-dongker-dark text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-dongker-dark italic">
                            &ldquo;{s}&rdquo;
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

              {/* Guiding questions */}
              {question.guidingQuestions &&
                question.guidingQuestions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-dongker mb-1.5">
                      Pertanyaan Panduan (untuk Membantu Menyusun Jawaban)
                    </h3>
                    <ul className="space-y-1.5">
                      {question.guidingQuestions.map((g, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-dongker"
                        >
                          <span className="text-dongker mt-0.5">&bull;</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Evaluation Criteria */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Kriteria Penilaian
                </h3>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {question.evaluationCriteria.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-dongker-dark/75 bg-krem-warm/60/60 rounded px-2 py-1.5 border border-slate-100"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emas mt-0.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div>
                <button
                  onClick={() => setShowTips((v) => !v)}
                  className="flex items-center gap-1 text-xs font-medium text-dongker-dark hover:text-dongker-dark"
                >
                  {showTips ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                  {showTips ? "Sembunyikan Tips" : "Tampilkan Tips Pengerjaan"}
                </button>
                {showTips && (
                  <ul className="mt-2 space-y-1.5 rounded-lg border border-emas/40 bg-emas/10/60 p-3">
                    {question.tips.map((t, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-dongker-dark"
                      >
                        <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recorder Card */}
          <Card className="border-emas/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-dongker-dark font-display">
                <Mic className="h-4 w-4 text-emas" />
                Perekam Jawaban Speaking
              </CardTitle>
              <CardDescription>
                Maksimum durasi rekaman: {question.recordingTimeSec}s
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preparation Phase */}
              {effectivePhase === "preparing" && (
                <div className="rounded-lg border border-dongker/30 bg-dongker/5/60 p-5 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-dongker">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">
                      Waktu Persiapan Membaca Soal
                    </span>
                  </div>
                  <div className="text-5xl font-bold text-dongker font-mono tabular-nums">
                    {fmtTime(prepRemaining)}
                  </div>
                  <p className="text-sm text-dongker/80">
                    Bacalah soal dengan saksama. Anda dapat mulai merekam
                    setelah waktu habis atau tekan tombol di bawah.
                  </p>
                  <Button
                    onClick={skipPreparation}
                    className="bg-dongker hover:bg-dongker/90 text-white"
                  >
                    Lewati &amp; Mulai Rekam
                  </Button>
                </div>
              )}

              {/* Ready to Record */}
              {effectivePhase === "ready-to-record" && (
                <div className="rounded-lg border border-dongker/25 bg-krem-warm/60/60 p-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-dongker">
                    <Mic className="h-5 w-5" />
                    <span className="font-semibold">Siap Merekam</span>
                  </div>
                  <p className="text-sm text-dongker-dark/75 max-w-md mx-auto">
                    Pastikan mikrofon berfungsi dan ruangan tenang. Klik tombol
                    di bawah untuk mulai merekam. Anda dapat merekam ulang
                    maksimal 3 kali per soal.
                  </p>
                  {recorder.errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {recorder.errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    size="lg"
                    onClick={handleStartRecording}
                    disabled={recorder.status === "requesting"}
                    className="bg-merah hover:bg-merah/90 text-white shadow-md"
                  >
                    {recorder.status === "requesting" ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Meminta Izin Mikrofon...
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2" />
                        Mulai Rekam Sekarang
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Recording */}
              {effectivePhase === "recording" && (
                <div className="rounded-lg border border-merah/40 bg-merah/5 p-5 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-merah">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-merah/50 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-merah" />
                    </span>
                    <span className="font-semibold tracking-wide">
                      SEDANG REKAM...
                    </span>
                  </div>
                  <div className="text-5xl font-bold text-merah font-mono tabular-nums">
                    {fmtTime(recorder.durationSec)}
                  </div>
                  <div className="text-sm text-merah/80">
                    Sisa waktu: {fmtTime(recRemaining)} &middot; Maks:{" "}
                    {fmtTime(question.recordingTimeSec)}
                  </div>
                  <Progress
                    value={
                      (recorder.durationSec / question.recordingTimeSec) * 100
                    }
                    className="h-2"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-merah">
                    <CheckCircle2 className="h-3 w-3" />
                    Anda dapat stop kapan saja setelah selesai berbicara.
                  </div>
                  <Button
                    size="lg"
                    onClick={handleStopRecording}
                    disabled={recorder.status === "stopping"}
                    className="bg-slate-800 hover:bg-slate-900 text-white"
                  >
                    {recorder.status === "stopping" ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Menghentikan...
                      </>
                    ) : (
                      <>
                        <Square className="h-5 w-5 mr-2" />
                        Stop &amp; Simpan Rekaman
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Recorded - Playback & Submit */}
              {effectivePhase === "recorded" && (
                <div className="rounded-lg border border-emas/50 bg-emas/10/40 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-dongker-dark">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Rekaman Selesai</span>
                  </div>
                  <div className="bg-krem-warm rounded-lg border border-emas/40 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">
                        Durasi rekaman
                      </span>
                      <span className="text-sm font-bold text-dongker-dark font-mono">
                        {fmtTime(recorder.durationSec)}
                      </span>
                    </div>
                    {recorder.audioBlobUrl && (
                      <audio
                        controls
                        src={recorder.audioBlobUrl}
                        className="w-full"
                      />
                    )}
                  </div>
                  {submitError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                  {savedJustNow === question.id ? (
                    <Alert className="border-emas/50 bg-emas/10">
                      <CheckCircle2 className="h-4 w-4 text-emas" />
                      <AlertDescription className="text-dongker-dark">
                        Jawaban tersimpan! Pindah ke soal berikutnya...
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRerecord}
                        className="flex-1 border-dongker/40"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Rekam Ulang
                      </Button>
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={effectivePhase === "submitting"}
                        className="flex-1 btn-batik border-emas hover:opacity-90 text-white"
                      >
                        {effectivePhase === "submitting" ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Simpan &amp; Lanjut
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Submitting */}
              {effectivePhase === "submitting" && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-emas mx-auto" />
                  <p className="text-sm text-dongker-dark/75 mt-2">
                    Menyimpan jawaban...
                  </p>
                </div>
              )}

              {/* Microphone error state */}
              {recorder.errorMessage && effectivePhase === "ready-to-record" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Mikrofon</AlertTitle>
                  <AlertDescription>
                    {recorder.errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="border-dongker/40"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            <div className="text-xs text-muted-foreground">
              Soal {currentIndex + 1} / {questions.length}
            </div>
            {currentIndex < questions.length - 1 ? (
              <Button
                variant="outline"
                onClick={() => goToQuestion(currentIndex + 1)}
                className="border-dongker/40"
              >
                Berikutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                disabled={answeredCount < questions.length}
                className="btn-batik border-emas hover:opacity-90 text-white"
              >
                <Send className="h-4 w-4 mr-1" />
                Submit Ujian
              </Button>
            )}
          </div>
        </main>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-dongker-dark">
              <Send className="h-5 w-5 text-emas" />
              Konfirmasi Submit Ujian
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pastikan semua jawaban Anda
              sudah optimal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg border border-dongker/25 bg-krem-warm/60/60 p-3">
              <p className="text-sm text-dongker mb-2">
                Status jawaban Anda:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {questions.map((q) => {
                  const isAnswered = q.answered || savedJustNow === q.id;
                  return (
                    <div
                      key={q.id}
                      className={`flex items-center gap-2 text-xs rounded px-2 py-1.5 ${
                        isAnswered
                          ? "bg-emas/10 text-dongker-dark"
                          : "bg-merah/5 text-merah"
                      }`}
                    >
                      {isAnswered ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span>
                        {q.id} - {q.sectionTitle.slice(0, 25)}
                        {q.sectionTitle.length > 25 ? "..." : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Terjawab: {answeredCount} / {questions.length}
              </p>
            </div>
            <Alert className="border-emas/40 bg-emas/10/60">
              <AlertCircle className="h-4 w-4 text-emas" />
              <AlertDescription className="text-dongker-dark text-sm">
                Setelah submit, Anda tidak dapat login ulang, mengubah jawaban,
                atau mengulang ujian. Pastikan koneksi internet stabil saat
                submit.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
              disabled={answeredCount < questions.length}
            >
              Kembali ke Ujian
            </Button>
            <Button
              onClick={onSubmitExam}
              disabled={answeredCount < questions.length}
              className="btn-batik border-emas hover:opacity-90 text-white"
            >
              <Send className="h-4 w-4 mr-1" />
              Ya, Submit Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

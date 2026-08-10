"use client";

// Halaman utama CBT Speaking Exam
// Mengatur state: login -> instructions -> exam -> submitted
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoginView } from "@/components/cbt-speaking/login-view";
import { InstructionsView } from "@/components/cbt-speaking/instructions-view";
import { ExamView, ExamQuestionClient } from "@/components/cbt-speaking/exam-view";
import { SubmitSuccessView } from "@/components/cbt-speaking/submit-success-view";
import { SplashScreen } from "@/components/cbt-speaking/splash-screen";
import { Loader2 } from "lucide-react";

type ViewState =
  | "splash"
  | "loading"
  | "login"
  | "instructions"
  | "exam"
  | "submitted";

interface StudentInfo {
  id: string;
  nim: string;
  name: string;
  programStudy: string;
  faculty: string;
  courseCode: string;
  courseName: string;
  examStatus: string;
  startedAt: string | null;
  submittedAt?: string | null;
}

interface SubmitSummary {
  totalQuestions: number;
  totalDurationSeconds: number;
  answers: {
    questionId: string;
    durationSeconds: number;
    attemptCount: number;
  }[];
}

export default function Home() {
  const [view, setView] = useState<ViewState>("splash");
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [questions, setQuestions] = useState<ExamQuestionClient[]>([]);
  const [submitSummary, setSubmitSummary] = useState<SubmitSummary | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const { toast } = useToast();

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (data.ok) {
        setStudent((prev) =>
          prev ? { ...prev, ...data.student } : data.student
        );
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Called when splash screen finishes (or is skipped)
  const handleSplashFinished = useCallback(() => {
    setView("loading");
  }, []);

  // Check session after splash screen finishes.
  // We use a separate effect that watches for view === "loading".
  useEffect(() => {
    if (view !== "loading") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/login", { method: "GET" });
        const data = await res.json();
        if (cancelled) return;
        if (data.ok && data.authenticated && data.student) {
          setStudent(data.student);
          // Fetch questions for resume case
          try {
            const qRes = await fetch("/api/questions");
            const qData = await qRes.json();
            if (cancelled) return;
            if (qData.ok) {
              setStudent((prev) =>
                prev ? { ...prev, ...qData.student } : qData.student
              );
              setQuestions(qData.questions);
            }
          } catch (err) {
            console.error(err);
          }
          if (data.student.examStatus === "SUBMITTED") {
            setView("login");
          } else {
            setView("instructions");
          }
        } else {
          setView("login");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setView("login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [view]);

  const handleLoginSuccess = async (s: StudentInfo) => {
    setStudent(s);
    await fetchQuestions();
    setView("instructions");
  };

  const handleStartExam = () => {
    setView("exam");
  };

  const handleAnswerSaved = (
    questionId: string,
    meta: { durationSeconds: number; attemptCount: number }
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answered: true,
              answerMeta: {
                durationSeconds: meta.durationSeconds,
                attemptCount: meta.attemptCount,
                recordedAt: new Date().toISOString(),
              },
            }
          : q
      )
    );
    toast({
      title: "Jawaban tersimpan",
      description: `Soal ${questionId} berhasil disimpan (${meta.attemptCount} percobaan, ${meta.durationSeconds.toFixed(0)}s).`,
    });
  };

  const handleSubmitExam = async () => {
    try {
      const res = await fetch("/api/session/submit", {
        method: "POST",
      });
      const data = await res.json();
      if (!data.ok) {
        toast({
          variant: "destructive",
          title: "Submit gagal",
          description: data.error || "Terjadi kesalahan saat submit.",
        });
        return;
      }
      setSubmitSummary(data.summary);
      setSubmittedAt(data.submittedAt);
      setView("submitted");
      toast({
        title: "Ujian selesai",
        description: "Jawaban Anda telah berhasil disubmit.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Koneksi gagal",
        description: "Periksa internet Anda lalu coba submit ulang.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setStudent(null);
    setQuestions([]);
    setSubmitSummary(null);
    setView("login");
  };

  // Splash screen (opening berbudaya VOCAL)
  if (view === "splash") {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  // Loading screen
  if (view === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 batik-mega">
        <Loader2 className="h-8 w-8 animate-spin text-emas" />
        <p className="text-sm text-sogan-dark font-display italic">
          Memuat sistem ujian...
        </p>
      </div>
    );
  }

  if (view === "login" || !student) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  if (view === "instructions") {
    return (
      <InstructionsView
        student={student}
        onStart={handleStartExam}
        onLogout={handleLogout}
        answeredQuestionIds={questions.filter((q) => q.answered).map((q) => q.id)}
        startedAt={student.startedAt}
      />
    );
  }

  if (view === "exam") {
    return (
      <ExamView
        student={student}
        questions={questions}
        onSubmitExam={handleSubmitExam}
        onLogout={handleLogout}
        onAnswerSaved={handleAnswerSaved}
      />
    );
  }

  if (view === "submitted" && submitSummary) {
    return (
      <SubmitSuccessView
        student={student}
        submittedAt={submittedAt}
        summary={submitSummary}
        onLogout={handleLogout}
      />
    );
  }

  // Fallback
  return <LoginView onLoginSuccess={handleLoginSuccess} />;
}

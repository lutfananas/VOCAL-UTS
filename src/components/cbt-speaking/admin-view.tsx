"use client";

// AdminView - Halaman untuk dosen menilai jawaban speaking mahasiswa
// - Login dengan password admin
// - Daftar mahasiswa + status pengerjaan
// - Klik mahasiswa untuk lihat detail 6 jawaban
// - Play audio setiap jawaban langsung di browser
// - Download audio individual atau export semua
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Lock,
  Loader2,
  Mic,
  Play,
  Download,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileAudio,
  Award,
  LogOut,
  Search,
  Save,
} from "lucide-react";

interface AdminAnswer {
  questionId: string;
  durationSeconds: number;
  attemptCount: number;
  recordedAt: string;
  // Score fields
  score: number | null;
  scoreMax: number;
  scoreNotes: string | null;
  scoredAt: string | null;
  scoredBy: string | null;
}

interface AdminStudent {
  id: string;
  nim: string;
  name: string;
  programStudy: string;
  faculty: string;
  examStatus: string;
  startedAt: string | null;
  submittedAt: string | null;
  answeredCount: number;
  totalQuestions: number;
  totalDurationSeconds: number;
  // Score summary
  totalScore: number;
  totalMaxScore: number;
  scoredCount: number;
  hasScore: boolean;
  answers: AdminAnswer[];
}

interface AdminQuestion {
  id: string;
  sectionNumber: number;
  sectionTitle: string;
  title: string;
  points: number;
  evaluationCriteria: string[];
}

interface AdminData {
  total: number;
  submitted: number;
  inProgress: number;
  notStarted: number;
  students: AdminStudent[];
  questions: AdminQuestion[];
}

const ADMIN_PASSWORD_DEFAULT = "admin123";

export function AdminView({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);
  const [search, setSearch] = useState("");
  // Score editing state: { [questionId]: { score, notes, saving, saved, error } }
  const [scoreEdits, setScoreEdits] = useState<
    Record<
      string,
      {
        score: string;
        notes: string;
        saving: boolean;
        saved: boolean;
        error: string | null;
      }
    >
  >({});

  // Persist password di localStorage (hanya browser, tidak dikirim ke server API selain via header)
  useEffect(() => {
    const saved = localStorage.getItem("cbt-admin-pass");
    if (saved) {
      setPassword(saved);
    }
  }, []);

  const fetchData = useCallback(async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students", {
        headers: { "x-admin-pass": pass },
      });
      const json = await res.json();
      if (!json.ok) {
        setAuthError(json.error || "Gagal memuat data.");
        setAuthed(false);
        return;
      }
      setData(json);
      setAuthed(true);
      setAuthError(null);
      localStorage.setItem("cbt-admin-pass", pass);
    } catch (err) {
      console.error(err);
      setAuthError("Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setAuthError("Password wajib diisi.");
      return;
    }
    fetchData(password);
  };

  const handleLogout = () => {
    setAuthed(false);
    setData(null);
    setSelectedStudent(null);
    setScoreEdits({});
    localStorage.removeItem("cbt-admin-pass");
    setPassword("");
  };

  // Init score edits saat mahasiswa dipilih
  const handleSelectStudent = (s: AdminStudent) => {
    setSelectedStudent(s);
    // Init score edits dengan nilai yang sudah ada (jika sudah pernah dinilai)
    const initial: typeof scoreEdits = {};
    s.answers.forEach((a) => {
      initial[a.questionId] = {
        score: a.score !== null ? String(a.score) : "",
        notes: a.scoreNotes ?? "",
        saving: false,
        saved: false,
        error: null,
      };
    });
    setScoreEdits(initial);
  };

  // Update field score edit
  const updateScoreEdit = (
    questionId: string,
    field: "score" | "notes",
    value: string
  ) => {
    setScoreEdits((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? { score: "", notes: "", saving: false, saved: false, error: null }),
        [field]: value,
        saved: false, // reset saved state saat ada perubahan
        error: null,
      },
    }));
  };

  // Save score ke server
  const handleSaveScore = async (
    studentId: string,
    questionId: string,
    scoreMax: number
  ) => {
    const edit = scoreEdits[questionId];
    if (!edit) return;

    setScoreEdits((prev) => ({
      ...prev,
      [questionId]: { ...edit, saving: true, error: null },
    }));

    try {
      const scoreValue = edit.score.trim() === "" ? null : parseFloat(edit.score);
      if (scoreValue !== null && isNaN(scoreValue)) {
        throw new Error("Nilai harus berupa angka.");
      }

      const res = await fetch("/api/admin/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pass": password,
        },
        body: JSON.stringify({
          studentId,
          questionId,
          scoreMax,
          score: scoreValue,
          scoreNotes: edit.notes.trim() || null,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Gagal menyimpan nilai.");
      }

      // Update local state (selected student + data)
      setScoreEdits((prev) => ({
        ...prev,
        [questionId]: {
          ...edit,
          saving: false,
          saved: true,
          error: null,
        },
      }));

      // Update selectedStudent dengan score baru
      if (selectedStudent) {
        const updatedAnswers = selectedStudent.answers.map((a) =>
          a.questionId === questionId
            ? {
                ...a,
                score: scoreValue,
                scoreNotes: edit.notes.trim() || null,
                scoreMax,
                scoredAt: new Date().toISOString(),
                scoredBy: "admin",
              }
            : a
        );
        const totalScore = updatedAnswers.reduce(
          (sum, a) => sum + (a.score ?? 0),
          0
        );
        const scoredCount = updatedAnswers.filter(
          (a) => a.score !== null
        ).length;
        setSelectedStudent({
          ...selectedStudent,
          answers: updatedAnswers,
          totalScore,
          scoredCount,
          hasScore: scoredCount > 0,
        });
      }

      // Update data list juga
      if (data) {
        const updatedStudents = data.students.map((st) =>
          st.id === studentId
            ? {
                ...st,
                answers: st.answers.map((a) =>
                  a.questionId === questionId
                    ? {
                        ...a,
                        score: scoreValue,
                        scoreNotes: edit.notes.trim() || null,
                        scoreMax,
                        scoredAt: new Date().toISOString(),
                        scoredBy: "admin",
                      }
                    : a
                ),
                totalScore:
                  (selectedStudent?.totalScore ?? 0) -
                  (selectedStudent?.answers.find((a) => a.questionId === questionId)?.score ?? 0) +
                  (scoreValue ?? 0),
                scoredCount:
                  (selectedStudent?.scoredCount ?? 0) +
                  (scoreValue === null && selectedStudent?.answers.find((a) => a.questionId === questionId)?.score !== null
                    ? -1
                    : scoreValue !== null && selectedStudent?.answers.find((a) => a.questionId === questionId)?.score === null
                    ? 1
                    : 0),
                hasScore: true,
              }
            : st
        );
        setData({ ...data, students: updatedStudents });
      }
    } catch (err) {
      const e = err as Error;
      setScoreEdits((prev) => ({
        ...prev,
        [questionId]: {
          ...edit,
          saving: false,
          error: e.message || "Gagal menyimpan nilai.",
        },
      }));
    }
  };

  // Get audio URL untuk playback
  // Note: <audio> tag tidak bisa set custom header, jadi password lewat query param
  // Ini acceptable untuk sistem internal dosen, tapi pastikan password tidak di-share
  const getAudioUrl = (studentId: string, questionId: string) => {
    return `/api/admin/answers/audio?studentId=${encodeURIComponent(
      studentId
    )}&questionId=${encodeURIComponent(questionId)}&p=${encodeURIComponent(password)}&t=${Date.now()}`;
  };

  // Download audio individual
  const handleDownloadAudio = async (
    studentId: string,
    questionId: string,
    nim: string
  ) => {
    try {
      const res = await fetch(
        `/api/admin/answers/audio?studentId=${studentId}&questionId=${questionId}`,
        { headers: { "x-admin-pass": password } }
      );
      if (!res.ok) {
        alert("Gagal download audio.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nim}-${questionId}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal download audio.");
    }
  };

  // Export semua data ke Excel (.xlsx)
  const handleExportAll = async () => {
    try {
      const res = await fetch(
        `/api/admin/export-excel?all=true&p=${encodeURIComponent(password)}`,
        { headers: { "x-admin-pass": password } }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Gagal export Excel.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Ambil filename dari header Content-Disposition
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="?([^"]+)"?/);
      a.download = match ? match[1] : `Nilai-CBT-Speaking-all-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal export Excel.");
    }
  };

  // Export per student ke Excel
  const handleExportStudent = async (studentId: string, nim: string) => {
    try {
      const res = await fetch(
        `/api/admin/export-excel?studentId=${studentId}&p=${encodeURIComponent(password)}`,
        { headers: { "x-admin-pass": password } }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Gagal export Excel.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="?([^"]+)"?/);
      a.download = match ? match[1] : `Nilai-CBT-Speaking-${nim}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal export Excel.");
    }
  };

  const fmtDate = (iso: string | null) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const fmtDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Filtered students
  const filteredStudents = data?.students.filter(
    (s) =>
      s.nim.includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  // ===== LOGIN SCREEN =====
  if (!authed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="h-2 bg-gradient-to-r from-dongker via-merah to-dongker fixed top-0 left-0 right-0" />
        <Card className="w-full max-w-md border-slate-200 shadow-lg batik-card">
          <CardHeader className="space-y-2 pt-6 text-center">
            <div className="mx-auto rounded-full bg-dongker/10 p-3 w-fit border-2 border-dongker/20">
              <Lock className="h-8 w-8 text-dongker" />
            </div>
            <CardTitle className="text-2xl text-dongker-dark font-display">
              Login Dosen / Admin
            </CardTitle>
            <CardDescription>
              Masukkan password admin untuk mengakses panel penilaian jawaban
              speaking mahasiswa.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-pass" className="text-dongker-dark">
                  Password Admin
                </Label>
                <Input
                  id="admin-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="h-12 border-slate-300 focus:border-dongker focus:ring-dongker/20"
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-slate-500">
                  Default password: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-dongker">{ADMIN_PASSWORD_DEFAULT}</code>
                </p>
              </div>
              {authError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {authError}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-12 btn-batik"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Masuk Panel Admin
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onExit}
                className="w-full border-slate-300 text-slate-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Halaman Login Mahasiswa
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // ===== LOADING =====
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dongker" />
      </div>
    );
  }

  // ===== DETAIL MAHASISWA =====
  if (selectedStudent && data) {
    const s = selectedStudent;
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
          <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedStudent(null)}
              className="text-slate-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali ke Daftar
            </Button>
            <h1 className="text-base md:text-lg font-bold text-dongker-dark font-display truncate">
              Penilaian: {s.name} ({s.nim})
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportStudent(s.id, s.nim)}
              className="border-dongker text-dongker hover:bg-dongker/5"
            >
              <Download className="h-4 w-4 mr-1" />
              Export Excel
            </Button>
          </div>
        </header>

        <div className="container mx-auto max-w-5xl px-4 py-6 space-y-5">
          {/* Student info card */}
          <Card className="border-slate-200 shadow-sm batik-card">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">NIM</p>
                  <p className="font-mono font-bold text-dongker-dark">{s.nim}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nama</p>
                  <p className="font-semibold text-slate-800">{s.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status Ujian</p>
                  <Badge
                    className={
                      s.examStatus === "SUBMITTED"
                        ? "bg-dongker text-white"
                        : s.examStatus === "IN_PROGRESS"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-300 text-slate-700"
                    }
                  >
                    {s.examStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Durasi Audio</p>
                  <p className="font-bold text-merah">
                    {fmtDuration(s.totalDurationSeconds)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Nilai</p>
                  <p className="font-bold text-dongker">
                    {s.totalScore.toFixed(1)} / {s.totalMaxScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Sudah Dinilai</p>
                  <p className="text-xs font-semibold text-slate-700">
                    {s.scoredCount} / {s.totalQuestions} soal
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Mulai</p>
                  <p className="text-xs text-slate-700">{fmtDate(s.startedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submit</p>
                  <p className="text-xs text-slate-700">{fmtDate(s.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Jawaban</p>
                  <p className="text-xs font-semibold text-slate-700">
                    {s.answeredCount} / {s.totalQuestions} soal
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Program Studi</p>
                  <p className="text-xs text-slate-700">{s.programStudy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daftar jawaban per soal */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-dongker-dark font-display flex items-center gap-2">
              <FileAudio className="h-5 w-5 text-merah" />
              Jawaban per Section
            </h2>

            {data.questions.map((q) => {
              const ans = s.answers.find((a) => a.questionId === q.id);
              return (
                <Card
                  key={q.id}
                  className="border-slate-200 shadow-sm batik-card overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge
                            variant="outline"
                            className="bg-dongker text-white border-dongker"
                          >
                            Section {q.sectionNumber}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-merah/10 border-merah text-merah"
                          >
                            {q.points} poin
                          </Badge>
                          <span className="text-xs font-mono text-slate-500">
                            {q.id}
                          </span>
                          {ans ? (
                            <Badge className="bg-dongker/10 text-dongker border border-dongker/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Sudah dijawab
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Belum dijawab
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm">
                          {q.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {q.sectionTitle}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ans ? (
                      <>
                        {/* Audio player */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Play className="h-3 w-3 text-dongker" />
                            <span>Putar audio jawaban mahasiswa:</span>
                          </div>
                          {/* Audio element - password via URL query (since <audio> cannot set headers) */}
                          <audio
                            controls
                            src={getAudioUrl(s.id, q.id)}
                            className="w-full"
                            preload="metadata"
                          />
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <p className="text-slate-500">Durasi</p>
                              <p className="font-mono font-bold text-dongker">
                                {fmtDuration(ans.durationSeconds)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Percobaan</p>
                              <p className="font-mono font-bold text-dongker">
                                #{ans.attemptCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Direkam</p>
                              <p className="text-slate-700">
                                {fmtDate(ans.recordedAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDownloadAudio(s.id, q.id, s.nim)
                            }
                            className="border-dongker text-dongker hover:bg-dongker/5"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download Audio
                          </Button>
                        </div>

                        {/* === FORM PENILAIAN DOSEN === */}
                        <div className="rounded-lg border-2 border-dongker/30 bg-dongker/5 p-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-dongker-dark">
                            <Award className="h-4 w-4 text-merah" />
                            Penilaian Dosen
                            {ans.scoredAt && (
                              <Badge
                                variant="outline"
                                className="ml-auto bg-emerald-50 border-emerald-300 text-emerald-700 text-[10px]"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Sudah dinilai: {fmtDate(ans.scoredAt)}
                              </Badge>
                            )}
                          </div>

                          {/* Kriteria penilaian (collapsible) */}
                          {q.evaluationCriteria && q.evaluationCriteria.length > 0 && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-slate-600 hover:text-dongker font-medium">
                                📋 Lihat kriteria penilaian ({q.evaluationCriteria.length} kriteria, max {q.points} poin)
                              </summary>
                              <ul className="mt-2 space-y-1 pl-4 text-slate-600">
                                {q.evaluationCriteria.map((c, i) => (
                                  <li key={i} className="list-disc list-inside">
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}

                          {/* Input nilai */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                            <div className="sm:col-span-1 space-y-1">
                              <label className="text-xs font-medium text-slate-700">
                                Nilai (maks {q.points})
                              </label>
                              <Input
                                type="number"
                                step="0.5"
                                min="0"
                                max={q.points}
                                placeholder={`0 - ${q.points}`}
                                value={scoreEdits[q.id]?.score ?? ""}
                                onChange={(e) =>
                                  updateScoreEdit(q.id, "score", e.target.value)
                                }
                                className="h-10 border-slate-300 bg-white focus:border-dongker focus:ring-dongker/20 font-mono text-base font-bold"
                                disabled={scoreEdits[q.id]?.saving}
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs font-medium text-slate-700">
                                Catatan / Komentar (opsional)
                              </label>
                              <Textarea
                                placeholder="Catatan untuk mahasiswa, kelebihan/kekurangan jawaban, saran perbaikan..."
                                value={scoreEdits[q.id]?.notes ?? ""}
                                onChange={(e) =>
                                  updateScoreEdit(q.id, "notes", e.target.value)
                                }
                                className="min-h-[60px] max-h-[120px] resize-y border-slate-300 bg-white focus:border-dongker focus:ring-dongker/20 text-sm"
                                disabled={scoreEdits[q.id]?.saving}
                                maxLength={2000}
                              />
                            </div>
                          </div>

                          {/* Error / success message */}
                          {scoreEdits[q.id]?.error && (
                            <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
                              <AlertCircle className="h-3 w-3 inline mr-1" />
                              {scoreEdits[q.id]?.error}
                            </div>
                          )}
                          {scoreEdits[q.id]?.saved && !scoreEdits[q.id]?.error && (
                            <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                              <CheckCircle2 className="h-3 w-3 inline mr-1" />
                              Nilai berhasil disimpan.
                            </div>
                          )}

                          {/* Tombol simpan */}
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => handleSaveScore(s.id, q.id, q.points)}
                              disabled={
                                scoreEdits[q.id]?.saving ||
                                (scoreEdits[q.id]?.score === (ans.score !== null ? String(ans.score) : "") &&
                                  scoreEdits[q.id]?.notes === (ans.scoreNotes ?? "") &&
                                  !scoreEdits[q.id]?.saved)
                              }
                              className="btn-batik"
                            >
                              {scoreEdits[q.id]?.saving ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Menyimpan...
                                </>
                              ) : (
                                <>
                                  <Save className="h-3 w-3 mr-1" />
                                  Simpan Nilai
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Mahasiswa ini tidak menjawab soal {q.id}.
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ===== DAFTAR MAHASISWA =====
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg btn-batik p-2">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Panel Dosen / Admin</p>
              <p className="text-sm font-bold text-dongker-dark font-display truncate">
                Penilaian Ujian Speaking CBT
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportAll}
              className="border-dongker text-dongker hover:bg-dongker/5"
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export Excel Semua</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="text-slate-600 hover:text-merah"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-slate-200 shadow-sm batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-dongker/10 p-2">
                  <Users className="h-5 w-5 text-dongker" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Mahasiswa</p>
                  <p className="text-xl font-bold text-dongker-dark font-display">
                    {data?.total ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submitted</p>
                  <p className="text-xl font-bold text-emerald-700 font-display">
                    {data?.submitted ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">In Progress</p>
                  <p className="text-xl font-bold text-amber-700 font-display">
                    {data?.inProgress ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm batik-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Award className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Belum Mulai</p>
                  <p className="text-xl font-bold text-slate-600 font-display">
                    {data?.notStarted ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari berdasarkan NIM atau nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-slate-300 focus:border-dongker focus:ring-dongker/20"
          />
        </div>

        {/* Daftar mahasiswa */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-dongker-dark font-display">
              Daftar Mahasiswa
            </CardTitle>
            <CardDescription>
              Klik mahasiswa untuk melihat & menilai 6 jawaban speaking
              mereka. Hanya mahasiswa dengan status SUBMITTED yang dapat
              dinilai.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[60vh] min-h-[300px] overflow-y-auto rounded-lg border border-slate-200 batik-scroll mb-4">
              <div className="divide-y divide-slate-100">
                {filteredStudents?.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStudent(s)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 ${
                      s.examStatus === "SUBMITTED" ? "" : "opacity-60"
                    }`}
                  >
                    {/* Avatar / number */}
                    <div
                      className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm font-display ${
                        s.examStatus === "SUBMITTED"
                          ? "bg-dongker text-white"
                          : s.examStatus === "IN_PROGRESS"
                          ? "bg-amber-200 text-amber-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {s.nim.slice(-2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800 truncate">
                          {s.name}
                        </p>
                        <span className="font-mono text-xs text-slate-500">
                          {s.nim}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>
                          {s.answeredCount} / {s.totalQuestions} jawaban
                        </span>
                        {s.totalDurationSeconds > 0 && (
                          <span className="text-merah">
                            ⏱ {fmtDuration(s.totalDurationSeconds)}
                          </span>
                        )}
                        {s.submittedAt && (
                          <span>Submit: {fmtDate(s.submittedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Badge
                        className={
                          s.examStatus === "SUBMITTED"
                            ? "bg-dongker text-white"
                            : s.examStatus === "IN_PROGRESS"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-300 text-slate-700"
                        }
                      >
                        {s.examStatus === "SUBMITTED"
                          ? "Dapat Dinilai"
                          : s.examStatus === "IN_PROGRESS"
                          ? "Sedang Mengerjakan"
                          : "Belum Mulai"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
          <CardContent className="p-4 text-sm text-blue-900 space-y-2">
            <p className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Cara Menilai Jawaban Speaking
            </p>
            <ol className="space-y-1 list-decimal pl-5 text-blue-800/90">
              <li>
                Klik nama mahasiswa dengan status <strong>Dapat Dinilai</strong>{" "}
                (SUBMITTED).
              </li>
              <li>
                Di halaman detail, klik tombol play pada setiap audio jawaban
                untuk mendengarkan.
              </li>
              <li>
                Berikan nilai di kolom <strong>Nilai (maks X poin)</strong>{" "}
                sesuai kriteria penilaian (klik "Lihat kriteria penilaian" untuk
                detail).
              </li>
              <li>
                Tambahkan <strong>Catatan/Komentar</strong> opsional untuk
                feedback ke mahasiswa.
              </li>
              <li>
                Klik tombol <strong>Simpan Nilai</strong> untuk menyimpan. Nilai
                tersimpan di database dan langsung terhitung di total nilai.
              </li>
              <li>
                Anda bisa ubah nilai kapan saja - cukup edit dan klik Simpan
                Nilai lagi.
              </li>
              <li>
                Untuk arsip, klik <strong>Download Audio</strong> per soal atau{" "}
                <strong>Export Excel</strong> untuk semua data (termasuk nilai).
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

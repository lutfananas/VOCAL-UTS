-- VOCAL CBT Speaking - D1 Database Schema
-- Cloudflare D1 (SQLite-compatible)

CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nim" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "programStudy" TEXT NOT NULL DEFAULT 'S1 Administrasi Publik',
    "faculty" TEXT NOT NULL DEFAULT 'FISIP',
    "courseCode" TEXT NOT NULL DEFAULT 'UTW2002',
    "courseName" TEXT NOT NULL DEFAULT 'Bahasa Inggris Bisnis',
    "examStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" DATETIME,
    "submittedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_nim_key" UNIQUE ("nim")
);

CREATE TABLE IF NOT EXISTS "SpeakingAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionSection" TEXT NOT NULL,
    "audioData" TEXT NOT NULL,
    "audioMimeType" TEXT NOT NULL DEFAULT 'audio/webm',
    "durationSeconds" REAL NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" REAL,
    "scoreMax" REAL NOT NULL DEFAULT 0,
    "scoreNotes" TEXT,
    "scoredAt" DATETIME,
    "scoredBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SpeakingAnswer_studentId_questionId_key" UNIQUE ("studentId", "questionId"),
    CONSTRAINT "SpeakingAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "SpeakingAnswer_studentId_idx" ON "SpeakingAnswer"("studentId");

CREATE TABLE IF NOT EXISTS "ExamLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExamLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "ExamLog_studentId_idx" ON "ExamLog"("studentId");

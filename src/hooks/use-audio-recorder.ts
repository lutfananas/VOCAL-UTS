"use client";

// Hook untuk merekam audio menggunakan MediaRecorder API
// Mengembalikan kontrol + state + audio base64
import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "recording"
  | "stopping"
  | "stopped"
  | "error";

export interface UseAudioRecorderResult {
  status: RecorderStatus;
  errorMessage: string | null;
  durationSec: number;
  isRecording: boolean;
  isReady: boolean;
  audioBase64: string | null;
  audioBlobUrl: string | null;
  audioMimeType: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => void;
  // Get audio base64 from a previous recording session (if needed)
  getAudioBase64: () => Promise<string | null>;
}

const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/mp4",
];

function pickMimeType(): string {
  if (typeof window === "undefined" || !window.MediaRecorder) return "audio/webm";
  for (const t of PREFERRED_MIME_TYPES) {
    if (window.MediaRecorder.isTypeSupported(t)) return t;
  }
  return "audio/webm";
}

export function useAudioRecorder(): UseAudioRecorderResult {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>("audio/webm");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastBlobRef = useRef<Blob | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const reset = useCallback(() => {
    clearTimer();
    stopStream();
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    lastBlobRef.current = null;
    setStatus("idle");
    setErrorMessage(null);
    setDurationSec(0);
    setAudioBase64(null);
    setAudioBlobUrl(null);
  }, [audioBlobUrl]);

  const start = useCallback(async () => {
    setErrorMessage(null);
    setStatus("requesting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Browser tidak mendukung akses mikrofon. Gunakan Chrome/Firefox/Edge terbaru."
        );
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      setAudioMimeType(mimeType);

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        lastBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
        setAudioBlobUrl(url);
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // result = "data:audio/webm;base64,AAAA..."
          const base64 = result.split(",")[1] ?? "";
          setAudioBase64(base64);
          setStatus("stopped");
        };
        reader.onerror = () => {
          setErrorMessage("Gagal mengonversi audio.");
          setStatus("error");
        };
        reader.readAsDataURL(blob);
        stopStream();
        clearTimer();
      };

      recorder.onerror = () => {
        setErrorMessage("Terjadi kesalahan pada MediaRecorder.");
        setStatus("error");
        stopStream();
        clearTimer();
      };

      recorder.start(250); // collect data every 250ms
      startTimeRef.current = Date.now();
      setDurationSec(0);
      setStatus("recording");

      // Timer
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setDurationSec(elapsed);
      }, 100);
    } catch (err) {
      console.error("[useAudioRecorder] start error", err);
      const e = err as Error;
      let msg = e.message || "Gagal mengakses mikrofon.";
      if (e.name === "NotAllowedError") {
        msg =
          "Akses mikrofon ditolak. Izinkan akses mikrofon di pengaturan browser, lalu coba lagi.";
      } else if (e.name === "NotFoundError") {
        msg =
          "Tidak ada mikrofon yang terdeteksi. Pasang headset/mikrofon dan coba lagi.";
      }
      setErrorMessage(msg);
      setStatus("error");
      stopStream();
      clearTimer();
    }
  }, [audioBlobUrl]);

  const stop = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    setStatus("stopping");
    try {
      recorder.stop();
    } catch (err) {
      console.error("[useAudioRecorder] stop error", err);
      setErrorMessage("Gagal menghentikan rekaman.");
      setStatus("error");
    }
  }, []);

  const getAudioBase64 = useCallback(async (): Promise<string | null> => {
    if (audioBase64) return audioBase64;
    if (!lastBlobRef.current) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1] ?? "";
        resolve(base64);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(lastBlobRef.current!);
    });
  }, [audioBase64]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      stopStream();
      if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    };
  }, [audioBlobUrl]);

  return {
    status,
    errorMessage,
    durationSec,
    isRecording: status === "recording",
    isReady: status === "ready" || status === "stopped",
    audioBase64,
    audioBlobUrl,
    audioMimeType,
    start,
    stop,
    reset,
    getAudioBase64,
  };
}

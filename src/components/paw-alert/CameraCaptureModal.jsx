import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiCamera } from "react-icons/fi";

export default function CameraCaptureModal({ open, onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError("");
    setReady(false);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch {
        setError("Tidak bisa mengakses kamera. Pastikan izin kamera diberikan (dan buka lewat https / localhost).");
      }
    })();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [open]);

  if (!open) return null;

  const snap = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `paw-alert-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-brand-blue-darker/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 z-10 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-brand-blue-darker text-sm flex items-center gap-2">
            <FiCamera size={16} className="text-red-500" /> Ambil Foto Hewan
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center border border-gray-100"
          >
            <FiX size={16} className="text-brand-blue-darker/60" />
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center">
          {error ? (
            <p className="text-white/80 text-xs text-center px-6">{error}</p>
          ) : (
            <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
          )}
          {!ready && !error && (
            <span className="absolute text-white/70 text-xs">Menyalakan kamera…</span>
          )}
        </div>

        <button
          type="button"
          onClick={snap}
          disabled={!ready || !!error}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold transition-colors"
        >
          <FiCamera size={16} /> Jepret Foto
        </button>
      </div>
    </motion.div>
  );
}
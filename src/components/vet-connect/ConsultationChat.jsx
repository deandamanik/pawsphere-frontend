import { useEffect, useRef, useState, useCallback } from "react";
import { LuArrowLeft, LuSend, LuCamera, LuMic } from "react-icons/lu";
import ChatMessage from "./ChatMessage";
import { getMessages, sendMessage } from "../../services/vetConnect.service";

const STATUS_LABEL = {
  pending: "Menunggu",
  active: "Aktif",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

// Kompres gambar di browser -> data URL (base64) kecil.
const compressImage = (file, maxSize = 1280, quality = 0.7) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const ConsultationChat = ({
  consultationId,
  title,
  subtitle,
  avatar,
  status,
  readOnly = false,
  onBack,
  headerExtra,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const load = useCallback(async () => {
    try {
      const rows = await getMessages(consultationId);
      setMessages(rows);
    } catch {
      // keep what we have on a transient error
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    setLoading(true);
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Kirim pesan generik (teks / gambar / audio) dengan optimistic UI.
  const pushMessage = async ({ content = "", type = "text", attachmentUrl = null }) => {
    if (sending) return;
    setSending(true);
    const temp = {
      id: `temp-${Date.now()}`,
      text: content,
      type,
      attachmentUrl,
      time: "",
      isOwn: true,
    };
    setMessages((prev) => [...prev, temp]);
    try {
      await sendMessage(consultationId, { content, type, attachmentUrl });
      await load();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      if (type === "text") setInput(content);
      alert(err.message || "Gagal mengirim pesan.");
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput("");
    await pushMessage({ content, type: "text" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ----- Foto -----
  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset agar file sama bisa dipilih lagi
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      await pushMessage({ type: "image", attachmentUrl: dataUrl });
    } catch {
      alert("Gagal memproses foto.");
    }
  };

  // ----- Rekam suara -----
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, {
          type: mr.mimeType || "audio/webm",
        });
        try {
          const dataUrl = await blobToDataUrl(blob);
          await pushMessage({ type: "audio", attachmentUrl: dataUrl });
        } catch {
          alert("Gagal memproses rekaman.");
        }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      alert("Tidak bisa mengakses mikrofon. Pastikan izin diberikan.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const isClosed = readOnly || status === "completed" || status === "cancelled";

  return (
    <div className="font-poppins bg-slate-50 flex flex-col h-full min-h-[70vh]">
      {/* Header */}
      <div className="bg-brand-blue-dark px-4 py-4 flex items-center gap-3 shadow-md">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <LuArrowLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {avatar && (
          <img src={avatar} alt={title} className="w-10 h-10 rounded-full object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm truncate">{title}</h3>
          {subtitle && <p className="text-white/70 text-xs truncate">{subtitle}</p>}
        </div>
        {status && (
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white font-semibold shrink-0">
            {STATUS_LABEL[status] || status}
          </span>
        )}
        {headerExtra}
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {loading ? (
          <p className="text-center text-sm text-slate-400 py-8">Memuat pesan…</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">
            Belum ada pesan. Mulai percakapan di bawah.
          </p>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} isOwn={m.isOwn} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input / closed notice */}
      {isClosed ? (
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-4 text-center text-sm text-slate-500 font-medium">
          Konsultasi ini sudah {STATUS_LABEL[status]?.toLowerCase() || "ditutup"}.
        </div>
      ) : (
        <div className="bg-white border-t border-slate-200 px-4 py-3">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus-within:border-brand-blue-normal focus-within:bg-white transition-all">
            {/* Foto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending || recording}
              title="Kirim foto"
              className="p-2 text-slate-400 hover:text-brand-blue-normal transition-colors disabled:opacity-40"
            >
              <LuCamera className="w-5 h-5" />
            </button>
            {/* Mic */}
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              disabled={sending}
              title={recording ? "Hentikan & kirim" : "Rekam suara"}
              className={`p-2 transition-colors disabled:opacity-40 ${
                recording
                  ? "text-red-500 animate-pulse"
                  : "text-slate-400 hover:text-brand-blue-normal"
              }`}
            >
              <LuMic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={recording ? "Merekam suara..." : "Ketik pesan..."}
              disabled={recording}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className={`p-1 transition-colors ${
                input.trim() && !sending
                  ? "text-brand-blue-normal hover:text-brand-blue-dark cursor-pointer"
                  : "text-slate-300 cursor-not-allowed"
              }`}
            >
              <LuSend className="w-5 h-5" />
            </button>
          </div>
          {recording && (
            <p className="text-[11px] text-red-500 mt-1 px-1">
              ● Merekam... tekan mic lagi untuk kirim
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationChat;
import { useEffect, useRef, useState, useCallback } from "react";
import { LuArrowLeft, LuSend } from "react-icons/lu";
import ChatMessage from "./ChatMessage";
import { getMessages, sendMessage } from "../../services/vetConnect.service";

// Shared chat panel. Polls for new messages every few seconds so both
// the patient and the vet see each other's replies without a refresh.
const STATUS_LABEL = {
  pending: "Menunggu",
  active: "Aktif",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

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
  const bottomRef = useRef(null);

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

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput("");
    setSending(true);
    const temp = { id: `temp-${Date.now()}`, text: content, time: "", isOwn: true };
    setMessages((prev) => [...prev, temp]);
    try {
      await sendMessage(consultationId, content);
      await load();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      setInput(content);
      alert(err.message || "Gagal mengirim pesan.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isClosed = readOnly || status === "completed" || status === "cancelled";

  return (
    <div className="font-poppins bg-slate-50 flex flex-col h-full min-h-[70vh]">
      {/* Header */}
      <div className="bg-brand-blue-dark px-4 py-4 flex items-center gap-3 shadow-md">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
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
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-brand-blue-normal focus-within:bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className={`transition-colors ${
                input.trim() && !sending
                  ? "text-brand-blue-normal hover:text-brand-blue-dark cursor-pointer"
                  : "text-slate-300 cursor-not-allowed"
              }`}
            >
              <LuSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationChat;
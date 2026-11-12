import { useState, useRef } from "react";
import AiDiagnoseContainer from "../../components/ai-diagnose/AiDiagnoseContainer";
import GuestLimitModal from "../../components/ai-diagnose/GuestLimitModal";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage } from "../../services/aiChat.service";
import Mascot from "../../components/ui/Mascot";
import {
  getGuestRemaining,
  setGuestRemaining,
  GUEST_FREE_LIMIT,
} from "../../lib/aiGuestLimit";

const AiDiagnose = () => {
  const { isAuthenticated, loading } = useAuth();
  const isGuest = !isAuthenticated;

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const inputRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const symptoms = [
    "Muntah",
    "Tidak mau makan",
    "Lemas",
    "Diare",
    "Gatal-gatal",
    "Batuk",
    "Bersin",
    "Mata berair",
  ];
  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTime = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleNewChat = () => {
    const newId = Date.now();
    setChats((prev) => [
      { id: newId, title: "Chat Baru", messages: [] },
      ...prev,
    ]);
    setActiveChatId(newId);
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    // Guest: blokir mulai percakapan BARU kalau kuota gratis habis.
    const prevMessages = activeChatId
      ? chats.find((c) => c.id === activeChatId)?.messages || []
      : [];
    const isNewSession = prevMessages.length === 0;
    if (isGuest && isNewSession && getGuestRemaining() <= 0) {
      setShowLimitModal(true);
      return;
    }

    let chatId = activeChatId;
    let baseMessages = [];
    if (chatId) {
      baseMessages = chats.find((c) => c.id === chatId)?.messages || [];
    } else {
      chatId = Date.now();
      setActiveChatId(chatId);
      setChats((prev) => [
        {
          id: chatId,
          title: trimmed.length > 30 ? trimmed.slice(0, 30) + "..." : trimmed,
          messages: [],
        },
        ...prev,
      ]);
    }

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: getTime(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              title:
                c.messages.length === 0
                  ? trimmed.length > 30
                    ? trimmed.slice(0, 30) + "..."
                    : trimmed
                  : c.title,
              messages: [...c.messages, userMsg],
            }
          : c,
      ),
    );
    setInputValue("");
    setIsTyping(true);

    const history = [...baseMessages, userMsg].map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const { reply, guest } = await sendChatMessage(history, {
        isGuest,
        sessionId: String(chatId),
      });
      if (guest && typeof guest.remaining === "number") {
        setGuestRemaining(guest.remaining);
      }
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: reply,
        time: getTime(),
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c,
        ),
      );
    } catch (err) {
      // Guest kena limit di server (mirror lokal out-of-sync) -> tampilkan modal.
      if (err?.type === "guest_limit_reached" || err?.status === 403) {
        setGuestRemaining(0);
        setShowLimitModal(true);
        return; // finally akan mematikan isTyping
      }
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text:
          err?.message ||
          "Maaf, terjadi kendala saat menghubungi AI. Coba lagi sebentar lagi ya.",
        time: getTime(),
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c,
        ),
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleRenameChat = (id, title) => {
    const t = title.trim();
    if (!t) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title: t, titleLocked: true } : c,
      ),
    );
  };

  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setActiveChatId((curr) => (curr === id ? null : curr));
  };

  const handleSymptomClick = (symptom) => {
    setInputValue((prev) => (prev ? `${prev}, ${symptom}` : symptom));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Saat sesi sedang dipulihkan, tampilkan spinner (jangan kedip gate).
  if (loading) {
    return (
      <div className="font-poppins bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Mascot state="loading" size={120} />
      </div>
    );
  }

  const chatState = {
    chats,
    activeChatId,
    activeChat,
    inputValue,
    isTyping,
    searchQuery,
    isSearching,
    symptoms,
    inputRef,
  };
  const chatActions = {
    setInputValue,
    setSearchQuery,
    setIsSearching,
    filteredChats,
    handleNewChat,
    handleSend,
    handleSymptomClick,
    handleKeyDown,
    handleChatSelect: setActiveChatId,
    handleRenameChat,
    handleDeleteChat,
  };

  return (
    <>
      <AiDiagnoseContainer chatState={chatState} chatActions={chatActions} />
      <GuestLimitModal
        open={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        limit={GUEST_FREE_LIMIT}
      />
    </>
  );
};

export default AiDiagnose;

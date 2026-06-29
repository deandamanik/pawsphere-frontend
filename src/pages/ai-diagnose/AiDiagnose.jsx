import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AiDiagnoseContainer from "../../components/ai-diagnose/AiDiagnoseContainer";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage } from "../../services/aiChat.service";

const AiDiagnose = () => {
  const { isAuthenticated, loading } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
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
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTime = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleNewChat = () => {
    const newId = Date.now();
    setChats((prev) => [{ id: newId, title: "Chat Baru", messages: [] }, ...prev]);
    setActiveChatId(newId);
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

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

    const userMsg = { id: Date.now(), role: "user", text: trimmed, time: getTime() };

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
          : c
      )
    );
    setInputValue("");
    setIsTyping(true);

    const history = [...baseMessages, userMsg].map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const { reply } = await sendChatMessage(history);
      const aiMsg = { id: Date.now() + 1, role: "ai", text: reply, time: getTime() };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c
        )
      );
    } catch (err) {
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
          c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleRenameChat = (id, title) => {
    const t = title.trim();
    if (!t) return;
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: t, titleLocked: true } : c))
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

  if (!isAuthenticated) {
    // While the session is being restored, don't show the gate yet.
  if (loading) {
    return (
      <div className="font-poppins bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-brand-blue-normal/30 border-t-brand-blue-normal animate-spin" />
      </div>
    );
  }

  // The chat endpoint needs a logged-in user.
  if (!isAuthenticated) {
    return (
      <div className="font-poppins bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Masuk untuk mulai diagnosa
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Login dulu untuk mengobrol dengan PawSphere AI.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-brand-blue-dark text-white text-sm font-semibold hover:bg-brand-blue-normal transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl border border-brand-blue-normal text-brand-blue-normal text-sm font-semibold hover:bg-brand-blue-light transition-all"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  }
  }

  const chatState = {
    chats, activeChatId, activeChat, inputValue, isTyping,
    searchQuery, isSearching, symptoms, inputRef,
  };
  const chatActions = {
    setInputValue, setSearchQuery, setIsSearching, filteredChats,
    handleNewChat, handleSend, handleSymptomClick, handleKeyDown,
    handleChatSelect: setActiveChatId,
    handleRenameChat,
    handleDeleteChat,
  };  
  

  return <AiDiagnoseContainer chatState={chatState} chatActions={chatActions} />;
};

export default AiDiagnose;
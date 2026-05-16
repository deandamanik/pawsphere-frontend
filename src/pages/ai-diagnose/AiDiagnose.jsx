import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuPlus,
  LuSearch,
  LuMic,
  LuSend,
  LuVideo,
  LuThumbsUp,
  LuThumbsDown,
  LuCopy,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { PiPawPrintFill, PiWarningCircleFill } from "react-icons/pi";

// Sidebar Content Component
const SidebarContent = ({
  handleNewChat,
  isSearching,
  setIsSearching,
  searchQuery,
  setSearchQuery,
  filteredChats,
  activeChatId,
  handleChatSelect,
  symptoms,
  handleSymptomClick,
}) => (
  <>
    {/* AI Chat Header Card */}
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-brand-blue-dark flex items-center justify-center">
          <PiPawPrintFill className="text-white w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">
            AI Chat Diagnosa
          </p>
          <p className="text-[10px] text-slate-400 leading-tight">
            Powered by PawSphere AI Engine
          </p>
        </div>
      </div>

      <button
        onClick={handleNewChat}
        className="flex items-center gap-2 w-full text-sm text-slate-600 hover:text-brand-blue-normal transition-colors py-1.5 cursor-pointer"
      >
        <LuPlus className="w-4 h-4" />
        <span>New Chat</span>
      </button>

      <button
        onClick={() => setIsSearching((v) => !v)}
        className="flex items-center gap-2 w-full text-sm text-slate-600 hover:text-brand-blue-normal transition-colors py-1.5 cursor-pointer"
      >
        <LuSearch className="w-4 h-4" />
        <span>Find Chat</span>
      </button>

      <AnimatePresence>
        {isSearching && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            type="text"
            placeholder="Cari chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mt-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand-blue-normal"
          />
        )}
      </AnimatePresence>

      <div className="mt-3">
        <p className="text-xs font-semibold text-slate-400 mb-2">Chats</p>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer truncate ${
                activeChatId === chat.id
                  ? "bg-brand-blue-light text-brand-blue-dark font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {chat.title}
            </button>
          ))}
        </div>
      </div>
    </div>

    <button className="flex items-center justify-center gap-2 bg-brand-blue-dark hover:bg-brand-blue-normal text-white text-sm font-semibold py-3 px-4 rounded-2xl transition-colors shadow-card cursor-pointer">
      <LuVideo className="w-4 h-4" />
      <span className="hidden md:inline">Hubungkan ke Dokter Hewan</span>
      <span className="md:hidden">Dokter Hewan</span>
    </button>

    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4">
      <p className="text-sm font-bold text-slate-700 mb-3">Gejala Umum</p>
      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => handleSymptomClick(symptom)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-full text-slate-600 hover:border-brand-blue-normal hover:text-brand-blue-normal hover:bg-brand-blue-light transition-all cursor-pointer"
          >
            {symptom}
          </button>
        ))}
      </div>
    </div>
  </>
);

const AiDiagnose = () => {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "Anjing peliharaan sukja gigit...",
      messages: [
        {
          id: 1,
          role: "user",
          text: 'Halo ai, anjing peliharaan saya sering gigit kaki saya, padahal saya tidak melakukan apa" T-T, kira kira itu karna apa ya?',
          time: "7:20",
        },
        {
          id: 2,
          role: "ai",
          text: 'Anjing yang suka menggigit kaki secara tiba-tiba biasanya melakukannya karena **insting bermain** yang tinggi atau rasa bosan, di mana mereka menganggap gerakan kaki Anda sebagai "mangsa" yang menarik untuk dikejar. Selain itu, perilaku ini sering menjadi cara mereka mencari perhatian atau tanda bahwa mereka sedang mengalami fase tumbuh gigi jika masih anjing kecil (puppy). Untuk mengatasinya, cobalah agar ia paham bahwa tindakan tersebut akan mengakhiri waktu bermainnya. 🐾 🎾',
          time: "7:20",
        },
        {
          id: 3,
          role: "user",
          text: "Oke terima kasih ai sangat membantu",
          time: "7:20",
        },
      ],
    },
    { id: 2, title: "Chat 2", messages: [] },
    { id: 3, title: "Chat 3", messages: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const getTime = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: "Chat Baru", messages: [] };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
    setInputValue("");
    setIsSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    let chatId = activeChatId;
    if (!chatId) {
      chatId = Date.now();
      const newChat = {
        id: chatId,
        title: trimmed.length > 30 ? trimmed.slice(0, 30) + "..." : trimmed,
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(chatId);
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

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: "Terima kasih sudah berbagi! Berdasarkan gejala yang kamu ceritakan, ada beberapa kemungkinan yang perlu diperhatikan. Sebaiknya konsultasikan lebih lanjut dengan dokter hewan untuk diagnosis yang lebih akurat. 🐾",
        time: getTime(),
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c,
        ),
      );
      setIsTyping(false);
    }, 1800);
  };

  const handleSymptomClick = (symptom) => {
    setInputValue((prev) => (prev ? `${prev}, ${symptom}` : symptom));
    setIsSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    setIsSidebarOpen(false);
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="font-poppins bg-slate-50 min-h-screen py-4 md:py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 md:gap-5 items-stretch min-h-[calc(100vh-8rem)] md:min-h-[600px]">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-4">
            <SidebarContent
              handleNewChat={handleNewChat}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredChats={filteredChats}
              activeChatId={activeChatId}
              handleChatSelect={handleChatSelect}
              symptoms={symptoms}
              handleSymptomClick={handleSymptomClick}
            />
          </aside>

          {/* Mobile Sidebar Drawer */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />

                {/* Drawer */}
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-72 bg-slate-50 z-50 lg:hidden overflow-y-auto p-4 flex flex-col gap-4"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="self-end p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <LuX className="w-5 h-5 text-slate-600" />
                  </button>

                  <SidebarContent
                    handleNewChat={handleNewChat}
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredChats={filteredChats}
                    activeChatId={activeChatId}
                    handleChatSelect={handleChatSelect}
                    symptoms={symptoms}
                    handleSymptomClick={handleSymptomClick}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-card border border-slate-100 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="px-3 sm:px-5 py-3 md:py-3.5 border-b border-slate-100 flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LuMenu className="w-5 h-5 text-slate-600" />
              </button>

              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                {activeChat ? activeChat.title : "AI Chat Diagnosa"}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
              {!activeChat || activeChat.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 py-8 sm:py-16 px-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg sm:text-2xl font-semibold text-slate-600 text-center"
                  >
                    Hi, Ada yang bisa ku bantu?
                  </motion.h2>
                </div>
              ) : (
                activeChat.messages.map((msg) =>
                  msg.role === "ai" ? (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]"
                    >
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-brand-blue-normal flex items-center justify-center shrink-0 mb-4 sm:mb-6">
                        <PiPawPrintFill className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="bg-brand-blue-normal text-white rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2 sm:py-3 shadow-sm text-xs sm:text-sm leading-relaxed">
                          {renderText(msg.text)}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 px-1">
                          <span className="text-[10px] sm:text-[11px] text-slate-400">
                            {msg.time}
                          </span>
                          <button className="text-slate-400 hover:text-brand-blue-normal transition-colors cursor-pointer">
                            <LuCopy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <button className="text-slate-400 hover:text-green-500 transition-colors cursor-pointer hidden sm:inline-block">
                            <LuThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer hidden sm:inline-block">
                            <LuThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2 sm:gap-3 max-w-[90%] sm:max-w-[75%] self-end"
                    >
                      <div className="flex flex-col items-end gap-1">
                        <div className="bg-slate-200 text-slate-700 rounded-2xl rounded-br-sm px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm">
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="text-[10px] sm:text-[11px] text-slate-400">
                            {msg.time}
                          </span>
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-blue-normal"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-300 flex items-center justify-center shrink-0 mb-4 sm:mb-6">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>
                    </motion.div>
                  ),
                )
              )}

              {isTyping && (
                <div className="flex items-end gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-brand-blue-normal flex items-center justify-center shrink-0">
                    <PiPawPrintFill className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-3 sm:h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-slate-100">
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 focus-within:border-brand-blue-normal focus-within:bg-white transition-all">
                <LuPlus className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeChat?.messages.length
                      ? "Ceritakan gejala..."
                      : "Tanyakan sesuatu..."
                  }
                  className="flex-1 bg-transparent text-xs sm:text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
                <button className="text-slate-400 hover:text-brand-blue-normal transition-colors cursor-pointer shrink-0 hidden sm:block">
                  <LuMic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    inputValue.trim()
                      ? "bg-brand-blue-normal hover:bg-brand-blue-normal-hover text-white shadow-sm"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <LuSend className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 md:mt-4 flex items-start gap-2 sm:gap-3 bg-amber-50 border border-amber-200 rounded-xl md:rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3.5"
        >
          <PiWarningCircleFill className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-amber-600">Perhatian: </span>
            Diagnosis AI ini hanya merupakan triase awal dan tidak menggantikan
            validasi dokter hewan profesional. Selalu konsultasikan dengan
            dokter hewan untuk penanganan yang tepat.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AiDiagnose;

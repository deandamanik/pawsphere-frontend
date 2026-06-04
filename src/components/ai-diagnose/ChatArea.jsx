import { motion } from "framer-motion";
import { LuMenu, LuCopy, LuThumbsUp, LuThumbsDown, LuPlus, LuMic, LuSend } from "react-icons/lu";
import { PiPawPrintFill } from "react-icons/pi";

const ChatArea = ({
  activeChat,
  setIsSidebarOpen,
  isTyping,
  inputValue,
  setInputValue,
  handleKeyDown,
  handleSend,
  inputRef,
}) => {
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
    <div className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-card border border-slate-100 flex flex-col overflow-hidden">
      <div className="px-3 sm:px-5 py-3 md:py-3.5 border-b border-slate-100 flex items-center gap-2">
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
            )
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
                      type: "keyframes",
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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
  );
};

export default ChatArea;
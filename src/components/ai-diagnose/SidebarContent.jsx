import { motion, AnimatePresence } from "framer-motion";
import { LuPlus, LuSearch, LuVideo, LuBrain } from "react-icons/lu";

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
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 16 }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-stretch gap-4 w-full"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 flex flex-col w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-blue-dark flex items-center justify-center">
            <LuBrain className="text-white w-4 h-4" />
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
          className="flex items-center gap-2 w-full text-sm text-slate-600 hover:text-brand-blue-normal transition-colors py-1.5 cursor-pointer outline-none"
        >
          <LuPlus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        <button
          onClick={() => setIsSearching((v) => !v)}
          className="flex items-center gap-2 w-full text-sm text-slate-600 hover:text-brand-blue-normal transition-colors py-1.5 cursor-pointer outline-none"
        >
          <LuSearch className="w-4 h-4" />
          <span>Find Chat</span>
        </button>

        <AnimatePresence>
          {isSearching && (
            <motion.input
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              type="text"
              placeholder="Cari chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand-blue-normal"
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
                className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer truncate outline-none ${
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
      </motion.div>

      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-brand-blue-dark hover:bg-brand-blue-normal text-white text-sm font-semibold py-3 px-4 rounded-2xl transition-colors shadow-card cursor-pointer outline-none"
      >
        <LuVideo className="w-4 h-4" />
        <span className="hidden md:inline">Hubungkan ke Dokter Hewan</span>
        <span className="md:hidden">Dokter Hewan</span>
      </motion.button>

      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 flex flex-col w-full"
      >
        <p className="text-sm font-bold text-slate-700 mb-3">Gejala Umum</p>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => handleSymptomClick(symptom)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-full text-slate-600 hover:border-brand-blue-normal hover:text-brand-blue-normal hover:bg-brand-blue-light transition-all cursor-pointer outline-none"
            >
              {symptom}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SidebarContent;
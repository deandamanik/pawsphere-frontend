import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LuPlus,
  LuSearch,
  LuVideo,
  LuBrain,
  LuEllipsisVertical,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuX,
} from "react-icons/lu";

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
  handleRenameChat,
  handleDeleteChat,
}) => {
  // menu = { id, top, left } position for the floating dropdown
  const [menu, setMenu] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 16 },
    },
  };

  const openMenu = (e, id) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ id, top: r.bottom + 4, left: Math.max(8, r.right - 150) });
  };

  const startRename = (id) => {
    const chat = filteredChats.find((c) => c.id === id);
    setEditingId(id);
    setEditValue(chat?.title || "");
    setMenu(null);
  };

  const commitRename = () => {
    if (editingId != null && editValue.trim()) {
      handleRenameChat?.(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditValue("");
  };

  const confirmDelete = (id) => {
    handleDeleteChat?.(id);
    setMenu(null);
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
            {filteredChats.length === 0 ? (
              <p className="text-[11px] text-slate-400 px-2 py-1.5">
                Belum ada chat.
              </p>
            ) : (
              filteredChats.map((chat) =>
                editingId === chat.id ? (
                  <div
                    key={chat.id}
                    className="flex items-center gap-1 px-1 py-1"
                  >
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") cancelRename();
                      }}
                      className="flex-1 min-w-0 px-2 py-1 text-xs border border-brand-blue-normal rounded-lg outline-none"
                    />
                    <button
                      onClick={commitRename}
                      className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"
                    >
                      <LuCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={cancelRename}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      <LuX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    key={chat.id}
                    className={`group flex items-center rounded-lg transition-colors ${
                      activeChatId === chat.id
                        ? "bg-brand-blue-light"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <button
                      onClick={() => handleChatSelect(chat.id)}
                      className={`flex-1 min-w-0 text-left text-xs px-2 py-1.5 rounded-lg truncate cursor-pointer outline-none ${
                        activeChatId === chat.id
                          ? "text-brand-blue-dark font-semibold"
                          : "text-slate-600"
                      }`}
                    >
                      {chat.title}
                    </button>
                    <button
                      onClick={(e) => openMenu(e, chat.id)}
                      className="p-1.5 mr-1 text-slate-400 hover:text-slate-700 rounded-md opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                    >
                      <LuEllipsisVertical className="w-4 h-4" />
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link
          to="/vet-connect"
          className="w-full flex items-center justify-center gap-2 bg-brand-blue-dark hover:bg-brand-blue-normal text-white text-sm font-semibold py-3 px-4 rounded-2xl transition-colors shadow-card cursor-pointer outline-none"
        >
          <LuVideo className="w-4 h-4" />
          <span className="hidden md:inline">Hubungkan ke Dokter Hewan</span>
          <span className="md:hidden">Dokter Hewan</span>
        </Link>
      </motion.div>

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

      {/* Floating dropdown menu (portaled to body so it is never clipped) */}
      {menu &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenu(null)}
            />
            <div
              className="fixed z-50 w-[150px] bg-white rounded-xl shadow-xl border border-slate-100 py-1.5"
              style={{ top: menu.top, left: menu.left }}
            >
              <button
                onClick={() => startRename(menu.id)}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <LuPencil className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={() => confirmDelete(menu.id)}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LuTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>,
          document.body
        )}
    </motion.div>
  );
};

export default SidebarContent;
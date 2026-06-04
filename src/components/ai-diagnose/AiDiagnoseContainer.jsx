import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";
import SidebarContent from "./SidebarContent";
import ChatArea from "./ChatArea";
import DisclaimerBanner from "./DisclaimerBanner";

const AiDiagnoseContainer = ({ chatState, chatActions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="font-poppins bg-slate-50 min-h-screen py-4 md:py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 md:gap-5 items-stretch min-h-[calc(100vh-8rem)] md:min-h-150">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-4">
            <SidebarContent
              handleNewChat={chatActions.handleNewChat}
              isSearching={chatState.isSearching}
              setIsSearching={chatActions.setIsSearching}
              searchQuery={chatState.searchQuery}
              setSearchQuery={chatActions.setSearchQuery}
              filteredChats={chatActions.filteredChats}
              activeChatId={chatState.activeChatId}
              handleChatSelect={(id) => {
                chatActions.handleChatSelect(id);
                setIsSidebarOpen(false);
              }}
              symptoms={chatState.symptoms}
              handleSymptomClick={(symptom) => {
                chatActions.handleSymptomClick(symptom);
                setIsSidebarOpen(false);
              }}
            />
          </aside>

          {/* Mobile Sidebar (Drawer) */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />

                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-72 bg-slate-50 z-50 overflow-y-auto p-4 flex flex-col gap-4"
                >
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="self-end p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <LuX className="w-5 h-5 text-slate-600" />
                  </button>

                  <SidebarContent
                    handleNewChat={chatActions.handleNewChat}
                    isSearching={chatState.isSearching}
                    setIsSearching={chatActions.setIsSearching}
                    searchQuery={chatState.searchQuery}
                    setSearchQuery={chatActions.setSearchQuery}
                    filteredChats={chatActions.filteredChats}
                    activeChatId={chatState.activeChatId}
                    handleChatSelect={(id) => {
                      chatActions.handleChatSelect(id);
                      setIsSidebarOpen(false);
                    }}
                    symptoms={chatState.symptoms}
                    handleSymptomClick={(symptom) => {
                      chatActions.handleSymptomClick(symptom);
                      setIsSidebarOpen(false);
                    }}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <ChatArea
            activeChat={chatState.activeChat}
            setIsSidebarOpen={setIsSidebarOpen}
            isTyping={chatState.isTyping}
            inputValue={chatState.inputValue}
            setInputValue={chatActions.setInputValue}
            handleKeyDown={chatActions.handleKeyDown}
            handleSend={chatActions.handleSend}
            inputRef={chatState.inputRef}
          />
        </div>

        <DisclaimerBanner />
      </div>
    </div>
  );
};

export default AiDiagnoseContainer;
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";
import SidebarContent from "./SidebarContent";
import ChatArea from "./ChatArea";
import DisclaimerBanner from "./DisclaimerBanner";

const AiDiagnoseContainer = ({ chatState, chatActions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="font-poppins bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center py-10 md:py-14 px-3 sm:px-6">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-5">

        <div className="flex gap-4 md:gap-6 items-stretch min-h-125 md:h-155">
          
          <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-4">
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
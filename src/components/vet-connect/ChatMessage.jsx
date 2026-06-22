import { motion } from "framer-motion";

const ChatMessage = ({ message, isOwn }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isOwn
            ? "bg-brand-blue-normal text-white rounded-br-sm"
            : "bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <span
          className={`text-[10px] mt-1 block ${
            isOwn ? "text-white/70" : "text-slate-400"
          }`}
        >
          {message.time}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;

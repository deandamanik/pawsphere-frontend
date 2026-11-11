import { motion } from "framer-motion";

const ChatMessage = ({ message, isOwn }) => {
  const type = message.type || "text";
  const hasAttachment = Boolean(message.attachmentUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-2 py-2 ${
          isOwn
            ? "bg-brand-blue-normal text-white rounded-br-sm"
            : "bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100"
        }`}
      >
        {type === "image" && hasAttachment && (
          <img
            src={message.attachmentUrl}
            alt="Foto"
            className="rounded-xl max-w-full max-h-64 object-cover mb-1"
          />
        )}

        {type === "audio" && hasAttachment && (
          <audio controls src={message.attachmentUrl} className="my-1 max-w-[220px]" />
        )}

        {message.text ? (
          <p className="text-sm leading-relaxed px-2">{message.text}</p>
        ) : null}

        <span
          className={`text-[10px] mt-1 block px-2 ${
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
import { useState, useRef } from "react";
import AiDiagnoseContainer from "../../components/ai-diagnose/AiDiagnoseContainer";

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
          text: 'Anjing yang suka menggigit kaki secara tiba-tiba biasanya melakukannya karena **insting bermain** yang tinggi atau rasa bosan, di mana mereka menganggap gerakan kaki Anda sebagai "mangsa" yang menarik untuk mengejar. Selain itu, perilaku ini sering menjadi cara mereka mencari perhatian atau tanda bahwa mereka sedang mengalami fase tumbuh gigi jika masih anjing kecil (puppy). Untuk mengatasinya, cobalah agar ia paham bahwa tindakan tersebut akan mengakhiri waktu bermainnya. 🐾 🎾',
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
  ]);

  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const symptoms = ["Muntah", "Tidak mau makan", "Lemas", "Diare", "Gatal-gatal", "Batuk", "Bersin", "Mata berair"];
  const filteredChats = chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

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

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    let chatId = activeChatId;
    if (!chatId) {
      chatId = Date.now();
      setChats((prev) => [{ id: chatId, title: trimmed.length > 30 ? trimmed.slice(0, 30) + "..." : trimmed, messages: [] }, ...prev]);
      setActiveChatId(chatId);
    }

    const userMsg = { id: Date.now(), role: "user", text: trimmed, time: getTime() };
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              title: c.messages.length === 0 ? (trimmed.length > 30 ? trimmed.slice(0, 30) + "..." : trimmed) : c.title,
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
      setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c)));
      setIsTyping(false);
    }, 1800);
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
  };

  return <AiDiagnoseContainer chatState={chatState} chatActions={chatActions} />;
};

export default AiDiagnose;
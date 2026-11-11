import { apiRequest } from "../lib/api";
import { getGuestId } from "../lib/aiGuestLimit";

// Free-form chat. messages: [{ role: "user" | "assistant", content }]
// opts: { isGuest, sessionId } — untuk guest kirim identitas supaya
// backend bisa meter 5 sesi gratis.
export const sendChatMessage = (messages, opts = {}) => {
  const { isGuest = false, sessionId } = opts;

  if (isGuest) {
    return apiRequest("/ai-chat/chat", {
      method: "POST",
      body: { messages },
      auth: false,
      headers: {
        "X-Guest-Id": getGuestId(),
        "X-Session-Id": String(sessionId),
      },
    });
  }

  return apiRequest("/ai-chat/chat", {
    method: "POST",
    body: { messages },
    auth: true,
  });
};

export const createTriage = (payload) =>
  apiRequest("/ai-chat/triage", { method: "POST", body: payload, auth: true });

export const getTriageHistories = () =>
  apiRequest("/ai-chat/histories", { auth: true });
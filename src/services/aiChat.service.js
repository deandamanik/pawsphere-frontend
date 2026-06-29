import { apiRequest } from "../lib/api";

// Free-form chat. messages: [{ role: "user" | "assistant", content }]
export const sendChatMessage = (messages) =>
  apiRequest("/ai-chat/chat", { method: "POST", body: { messages }, auth: true });

export const createTriage = (payload) =>
  apiRequest("/ai-chat/triage", { method: "POST", body: payload, auth: true });

export const getTriageHistories = () =>
  apiRequest("/ai-chat/histories", { auth: true });
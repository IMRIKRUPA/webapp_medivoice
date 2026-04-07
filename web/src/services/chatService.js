import api from "./api";

export async function sendChatMessage(payload) {
  const response = await api.post("/chat/message", payload);
  return response.data;
}

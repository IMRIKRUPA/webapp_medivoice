import api from "./api";

export async function getChatHistory(params = {}) {
  const response = await api.get("/history/chat", { params });
  return response.data;
}

export async function getHealthHistory(params = {}) {
  const response = await api.get("/history/health", { params });
  return response.data;
}

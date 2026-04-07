import api from "./api";

export async function getInsights(params = {}) {
  const response = await api.get("/insights", { params });
  return response.data;
}

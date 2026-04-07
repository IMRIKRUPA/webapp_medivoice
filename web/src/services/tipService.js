import api from "./api";

export async function getDailyTip() {
  const response = await api.get("/tips/daily");
  return response.data;
}

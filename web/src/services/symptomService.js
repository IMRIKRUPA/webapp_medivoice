import api from "./api";

export async function analyzeSymptoms(payload) {
  const response = await api.post("/symptoms/analyze", payload);
  return response.data;
}

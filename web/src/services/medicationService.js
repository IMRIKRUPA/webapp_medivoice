import api from "./api";

export async function getMedications(params = {}) {
  const response = await api.get("/medications", { params });
  return response.data;
}

export async function createMedication(payload) {
  const response = await api.post("/medications", payload);
  return response.data;
}

export async function updateMedication(id, payload) {
  const response = await api.put(`/medications/${id}`, payload);
  return response.data;
}

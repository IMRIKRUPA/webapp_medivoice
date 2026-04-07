import api from "./api";

export async function getAppointments(params = {}) {
  const response = await api.get("/appointments", { params });
  return response.data;
}

export async function createAppointment(payload) {
  const response = await api.post("/appointments", payload);
  return response.data;
}

export async function updateAppointment(id, payload) {
  const response = await api.put(`/appointments/${id}`, payload);
  return response.data;
}

export async function deleteAppointment(id) {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
}

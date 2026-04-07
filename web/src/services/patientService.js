import api from "./api";

export async function getPatient(patientId) {
  const response = await api.get(`/patient/${patientId}`);
  return response.data;
}

export async function updatePatient(patientId, payload) {
  const response = await api.put(`/patient/${patientId}`, payload);
  return response.data;
}

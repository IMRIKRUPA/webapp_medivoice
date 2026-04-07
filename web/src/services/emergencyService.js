import api from "./api";

export async function getEmergencyCheck({ symptoms, severity }) {
  const response = await api.get("/emergency/check", {
    params: {
      symptoms: symptoms.join(","),
      severity,
    },
  });
  return response.data;
}

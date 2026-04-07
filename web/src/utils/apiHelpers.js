export function extractApiError(error) {
  const payload = error?.response?.data;
  return {
    message: payload?.message || error?.message || "Something went wrong.",
    code: payload?.error?.code || "SERVER_ERROR",
    details: payload?.error?.details || {},
  };
}

export function ensureSuccess(payload) {
  if (payload?.success) {
    return payload;
  }

  throw new Error(payload?.message || "Request failed.");
}

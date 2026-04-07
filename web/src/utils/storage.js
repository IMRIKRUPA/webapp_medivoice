const STORAGE_KEY = "medivoice-web-auth";

export function getStoredAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

export function storeAuth(payload) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(STORAGE_KEY);
}

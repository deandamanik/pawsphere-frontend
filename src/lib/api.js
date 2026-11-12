// ============================================================
// Thin fetch wrapper around the PawSphere backend.
// - Injects the JWT from localStorage on authenticated calls.
// - Supports extra custom headers (e.g. guest identity).
// - Unwraps the backend envelope { success, message, data, type, errors }.
// - Throws a typed ApiError so callers can show clean messages.
// ============================================================

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/+$/, "");
const TOKEN_KEY = "pawsphere_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, status = 0, errors = [], type = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.type = type; // mis. "guest_limit_reached"
  }
}

/**
 * @param {string} path   e.g. "/auth/login"
 * @param {object} opts   { method, body, auth, headers }
 * @returns {Promise<any>} the `data` field of the response envelope
 */
export async function apiRequest(
  path,
  { method = "GET", body, auth = false, headers: extraHeaders } = {}
) {
  const headers = { "Content-Type": "application/json", ...(extraHeaders || {}) };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.",
      0
    );
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok || !payload?.success) {
    const message = payload?.message || "Terjadi kesalahan pada server.";
    throw new ApiError(
      message,
      res.status,
      payload?.errors || [],
      payload?.type || null
    );
  }

  return payload.data;
}

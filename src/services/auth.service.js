// Auth-related API calls. Each returns the `data` payload from the
// backend (already unwrapped by apiRequest).

import { apiRequest } from "../lib/api";

export const loginRequest = ({ email, password }) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const registerRequest = (form) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: form,
  });

export const fetchMe = () => apiRequest("/auth/me", { auth: true });

// payload keys: { name?, phone_number?, avatar_url? }
export const updateMe = (payload) =>
  apiRequest("/auth/me", { method: "PATCH", body: payload, auth: true });

// payload keys: { current_password, new_password }
export const changePassword = (payload) =>
  apiRequest("/auth/password", { method: "PATCH", body: payload, auth: true });
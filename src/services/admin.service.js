// src/services/admin.service.js
import { apiRequest } from "../lib/api";

// Ambil semua pengguna (khusus admin)
export const getUsers = () => apiRequest("/admin/users", { auth: true });

// Ubah role seorang pengguna (khusus admin)
export const updateUserRole = (id, role) =>
  apiRequest(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: { role },
    auth: true,
  });
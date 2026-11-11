import { apiRequest } from "../lib/api";

export const getClinicDashboard = () =>
  apiRequest("/clinic-admin/me", { auth: true });

export const getClinicReservations = (status = "all") =>
  apiRequest(`/clinic-admin/reservations?status=${encodeURIComponent(status)}`, { auth: true });

export const updateReservationStatus = (id, status) =>
  apiRequest(`/clinic-admin/reservations/${id}/status`, {
    method: "PATCH",
    body: { status },
    auth: true,
  });
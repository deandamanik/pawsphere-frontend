import { apiRequest } from "../lib/api";

export const createClinicBooking = (clinicId, payload, idempotencyKey) =>
  apiRequest(`/clinic-bookings/${encodeURIComponent(clinicId)}/reservations`, {
    method: "POST",
    body: payload,
    auth: true,
    headers: { "Idempotency-Key": idempotencyKey },
  });

export const getClinicBooking = (id) =>
  apiRequest(`/clinic-bookings/reservations/${encodeURIComponent(id)}`, {
    auth: true,
  });

export const updateClinicBookingAddress = (id, payload) =>
  apiRequest(
    `/clinic-bookings/reservations/${encodeURIComponent(id)}/address`,
    {
      method: "PATCH",
      body: payload,
      auth: true,
    }
  );

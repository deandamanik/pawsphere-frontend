import { apiRequest } from "../lib/api";

let snapScriptPromise;

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

export const refreshClinicBookingPaymentStatus = (id) =>
  apiRequest(
    `/clinic-bookings/reservations/${encodeURIComponent(id)}/refresh-payment`,
    {
      method: "POST",
      auth: true,
    }
  );

export const loadMidtransSnap = (scriptUrl, clientKey) => {
  const allowedScriptUrls = [
    "https://app.sandbox.midtrans.com/snap/snap.js",
    "https://app.midtrans.com/snap/snap.js",
  ];
  if (!allowedScriptUrls.includes(scriptUrl) || !clientKey) {
    return Promise.reject(new Error("Konfigurasi popup QRIS belum tersedia."));
  }
  if (window.snap) return Promise.resolve(window.snap);
  if (snapScriptPromise) return snapScriptPromise;

  snapScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.dataset.clientKey = clientKey;
    script.onload = () => {
      if (window.snap) {
        resolve(window.snap);
      } else {
        snapScriptPromise = null;
        reject(new Error("Popup Midtrans gagal dimuat."));
      }
    };
    script.onerror = () => {
      snapScriptPromise = null;
      reject(new Error("Tidak dapat memuat layanan popup Midtrans."));
    };
    document.head.appendChild(script);
  });

  return snapScriptPromise;
};

export const updateClinicBookingAddress = (id, payload) =>
  apiRequest(
    `/clinic-bookings/reservations/${encodeURIComponent(id)}/address`,
    {
      method: "PATCH",
      body: payload,
      auth: true,
    }
  );

// Vet Connect API calls.
import { apiRequest } from "../lib/api";

// public
export const getVets = () => apiRequest("/vet-connect/vets");
export const getVet = (id) => apiRequest(`/vet-connect/vets/${id}`);

// patient
export const createConsultation = (payload) =>
  apiRequest("/vet-connect/consultations", { method: "POST", body: payload, auth: true });

export const getMyConsultations = () =>
  apiRequest("/vet-connect/consultations", { auth: true });

// vet
export const getVetConsultations = () =>
  apiRequest("/vet-connect/vet/consultations", { auth: true });

export const updateConsultationStatus = (id, status) =>
  apiRequest(`/vet-connect/consultations/${id}/status`, {
    method: "PATCH",
    body: { status },
    auth: true,
  });

// chat (both sides)
export const getMessages = (id) =>
  apiRequest(`/vet-connect/consultations/${id}/messages`, { auth: true });

export const sendMessage = (id, content) =>
  apiRequest(`/vet-connect/consultations/${id}/messages`, {
    method: "POST",
    body: { content },
    auth: true,
  });
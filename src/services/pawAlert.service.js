// Paw Alert API calls.
import { apiRequest } from "../lib/api";

// reporter (any logged-in user)
export const createReport = (payload) =>
  apiRequest("/paw-alert/reports", { method: "POST", body: payload, auth: true });

export const getMyReports = () =>
  apiRequest("/paw-alert/reports/mine", { auth: true });

// shelter / admin
export const getActiveReports = () =>
  apiRequest("/paw-alert/reports", { auth: true });

export const updateReportStatus = (id, status) =>
  apiRequest(`/paw-alert/reports/${id}/status`, {
    method: "PATCH",
    body: { status },
    auth: true,
  });
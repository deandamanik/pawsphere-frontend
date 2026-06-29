// Donation (Care Funding) API calls.
import { apiRequest } from "../lib/api";

export const getCampaigns = () => apiRequest("/donation/campaigns");
export const getCampaign = (id) => apiRequest("/donation/campaigns/" + id);
export const donate = (id, payload) =>
  apiRequest("/donation/campaigns/" + id + "/donate", { method: "POST", body: payload });

export const getShelterCampaigns = () =>
  apiRequest("/donation/shelter/campaigns", { auth: true });
export const createCampaign = (payload) =>
  apiRequest("/donation/campaigns", { method: "POST", body: payload, auth: true });
export const updateCampaignStatus = (id, status) =>
  apiRequest("/donation/campaigns/" + id + "/status", { method: "PATCH", body: { status }, auth: true });
export const deleteCampaign = (id) =>
  apiRequest("/donation/campaigns/" + id, { method: "DELETE", auth: true });
// Adoption API calls.
import { apiRequest } from "../lib/api";

export const getAnimals = () => apiRequest("/adoption/animals");
export const getAnimal = (id) => apiRequest("/adoption/animals/" + id);

export const applyAdoption = (payload) =>
  apiRequest("/adoption/applications", { method: "POST", body: payload, auth: true });
export const getMyApplications = () =>
  apiRequest("/adoption/applications/mine", { auth: true });

export const getShelterAnimals = () =>
  apiRequest("/adoption/shelter/animals", { auth: true });
export const createAnimal = (payload) =>
  apiRequest("/adoption/animals", { method: "POST", body: payload, auth: true });
export const updateAnimalStatus = (id, adoption_status) =>
  apiRequest("/adoption/animals/" + id + "/status", { method: "PATCH", body: { adoption_status }, auth: true });
export const deleteAnimal = (id) =>
  apiRequest("/adoption/animals/" + id, { method: "DELETE", auth: true });
export const getShelterApplications = () =>
  apiRequest("/adoption/shelter/applications", { auth: true });
export const updateApplicationStatus = (id, status) =>
  apiRequest("/adoption/applications/" + id + "/status", { method: "PATCH", body: { status }, auth: true });
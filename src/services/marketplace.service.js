import { apiRequest } from "../lib/api";

export const getProducts = () => apiRequest("/marketplace/products");
export const getProduct = (id) => apiRequest("/marketplace/products/" + id);

export const createOrder = (payload) =>
  apiRequest("/marketplace/orders", { method: "POST", body: payload, auth: true });
export const getMyOrders = () => apiRequest("/marketplace/orders/mine", { auth: true });
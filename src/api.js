import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({ baseURL });

export const membersApi = {
  list: (search = "") => client.get("/members", { params: search ? { search } : {} }).then((r) => r.data),
  create: (data) => client.post("/members", data).then((r) => r.data),
  update: (id, data) => client.put(`/members/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/members/${id}`).then((r) => r.data),
};

export const paymentsApi = {
  list: (params = {}) => client.get("/payments", { params }).then((r) => r.data),
  create: (data) => client.post("/payments", data).then((r) => r.data),
  update: (id, data) => client.put(`/payments/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/payments/${id}`).then((r) => r.data),
};

export const expensesApi = {
  list: (params = {}) => client.get("/expenses", { params }).then((r) => r.data),
  create: (data) => client.post("/expenses", data).then((r) => r.data),
  update: (id, data) => client.put(`/expenses/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/expenses/${id}`).then((r) => r.data),
};

export const menuApi = {
  list: () => client.get("/menu").then((r) => r.data),
  update: (id, data) => client.put(`/menu/${id}`, data).then((r) => r.data),
  reset: () => client.post("/menu/reset").then((r) => r.data),
};

export default client;

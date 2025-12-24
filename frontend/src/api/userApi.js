import api from "./axios";

export const createUser = (data) => api.post("/users", data);
export const getAllUsers = () => api.get("/users");
export const deleteUser = (userId) =>api.delete(`/users/${userId}`);
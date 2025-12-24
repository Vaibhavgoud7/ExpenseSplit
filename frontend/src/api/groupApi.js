import api from "./axios";

export const createGroup = (data) => api.post("/groups", data);
export const getGroupById = (groupId) => api.get(`/groups/${groupId}`);
export const getAllGroups = () => api.get("/groups");
export const deleteGroup = (groupId) => api.delete(`/groups/${groupId}`);
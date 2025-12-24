import api from "./axios";

export const getUserBalances = (userId) =>
  api.get(`/balances/user/${userId}/simplified`);

export const getGroupBalances = (groupId) =>
  api.get(`/balances/group/${groupId}`);

export const settleBalance = (data) =>
  api.post("/balances/settle", data);

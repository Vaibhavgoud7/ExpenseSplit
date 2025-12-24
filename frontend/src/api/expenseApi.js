import api from "./axios";

export const addExpense = (data) => api.post("/expenses", data);
export const getExpensesByGroup = (groupId) =>
  api.get(`/expenses/group/${groupId}`);

import API from "./api-main";

export const loginUser = async (credentials) => {
  const res = await API.post("/api/auth/login", credentials);
  return res;
};

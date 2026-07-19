export const getToken = () => typeof window !== "undefined" ? localStorage.getItem("tesla_token") : null;
export const setToken = (t: string) => typeof window !== "undefined" && localStorage.setItem("tesla_token", t);
export const clearToken = () => typeof window !== "undefined" && localStorage.removeItem("tesla_token");

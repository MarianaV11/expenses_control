export const setToken = (token: string, user?: string) => {
  localStorage.setItem("financeControlToken", token);
  user && localStorage.setItem("financeControlUser", user);
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("financeControlToken");
  return token && token !== "null" ? token : null;
};

export const getUser = (): string | null => {
  const user = localStorage.getItem("financeControlUser");
  return user && user !== "null" ? user : null;
};

export const removeToken = (): void => {
  localStorage.removeItem("financeControlUser");
  localStorage.removeItem("financeControlToken");
};

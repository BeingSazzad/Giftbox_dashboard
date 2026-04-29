export const TOKEN_STORAGE_KEY = "token";

export const setToLocalStorage = (key: string, value: string) => {
  if (!key || typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
  if (!key || typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(key);
};

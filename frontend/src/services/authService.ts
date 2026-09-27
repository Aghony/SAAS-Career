import type { AuthResponse, User } from "../types/auth.types";
import { api } from "./api";
import { tokenStore } from "./tokenStore";

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const res = await api.post<{ data: AuthResponse }>("/auth/login", input);
    tokenStore.set(res.data.data.accessToken);
    return res.data.data;
  },

  async login(input: { email: string; password: string }) {
    const res = await api.post<{ data: AuthResponse }>("/auth/login", input);
    tokenStore.set(res.data.data.accessToken);
    return res.data.data;
  },
  async logout() {
    await api.post("/auth/logout");
    tokenStore.set(null);
  },

  async refreshSession(): Promise<User> {
    const res = await api.post<{ data: AuthResponse }>("/auth/refresh");
    tokenStore.set(res.data.data.accessToken);
    return res.data.data.user;
  },
};

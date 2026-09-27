import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";
import type { User } from "../types/auth.types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService
      .refreshSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user } = await authService.login({ email, password });
    setUser(user);
  }

  async function register(name: string, email: string, password: string) {
    const { user } = await authService.register({ name, email, password });
    setUser(user);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
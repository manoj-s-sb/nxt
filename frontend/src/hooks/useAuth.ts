"use client";

import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  type UserResponse,
} from "@/api/auth";
import { clearToken, saveToken } from "@/lib/auth";
import { useUserStore } from "@/store/userStore";

export function useAuth() {
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  async function register(
    email: string,
    password: string,
  ): Promise<UserResponse> {
    return registerUser({ email, password });
  }

  async function login(email: string, password: string): Promise<UserResponse> {
    try {
      const token = await loginUser({ email, password });
      saveToken(token.access_token);
      const user = await fetchCurrentUser();
      setUser(user);
      return user;
    } catch (err) {
      clearToken();
      throw err;
    }
  }

  async function registerAndLogin(
    email: string,
    password: string,
  ): Promise<UserResponse> {
    await register(email, password);
    return login(email, password);
  }

  function logout(): void {
    clearToken();
    clearUser();
  }

  return { register, login, registerAndLogin, logout };
}

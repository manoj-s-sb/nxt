import { api, extractErrorMessage } from "@/lib/api";

import type {
  LoginPayload,
  RegisterPayload,
  TokenResponse,
  UserResponse,
} from "./types";

const BASE = "/api/v1/auth";

export async function registerUser(
  payload: RegisterPayload,
): Promise<UserResponse> {
  try {
    const { data } = await api.post<UserResponse>(`${BASE}/register`, payload);
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "could not create account"));
  }
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  try {
    const { data } = await api.post<TokenResponse>(`${BASE}/login`, payload);
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "sign-in failed"));
  }
}

export async function fetchCurrentUser(): Promise<UserResponse> {
  try {
    const { data } = await api.get<UserResponse>(`${BASE}/me`);
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "session expired"));
  }
}

import api from "./api";
import type { LoginResponse, AdminUser } from "../types";

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function getProfile(): Promise<AdminUser> {
  const { data } = await api.get("/auth/me");
  return data;
}

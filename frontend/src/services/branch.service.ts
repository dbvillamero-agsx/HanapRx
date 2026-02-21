import api from "./api";
import type { PaginatedResponse, Branch } from "../types";

export async function getAllBranches(page = 1, limit = 20, pharmacyId?: number): Promise<PaginatedResponse<Branch>> {
  const params: Record<string, unknown> = { page, limit };
  if (pharmacyId) params.pharmacyId = pharmacyId;
  const { data } = await api.get("/branches", { params });
  return data;
}

export async function getBranch(id: number): Promise<Branch> {
  const { data } = await api.get(`/branches/${id}`);
  return data;
}

export async function createBranch(input: Omit<Branch, "id" | "pharmacy">): Promise<Branch> {
  const { data } = await api.post("/branches", input);
  return data;
}

export async function updateBranch(id: number, input: Partial<Branch>): Promise<Branch> {
  const { data } = await api.put(`/branches/${id}`, input);
  return data;
}

export async function deleteBranch(id: number): Promise<void> {
  await api.delete(`/branches/${id}`);
}

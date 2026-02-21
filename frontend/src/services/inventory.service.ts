import api from "./api";
import type { PaginatedResponse, Inventory } from "../types";

export async function getAllInventory(page = 1, limit = 20, branchId?: number, medicineId?: number): Promise<PaginatedResponse<Inventory>> {
  const params: Record<string, unknown> = { page, limit };
  if (branchId) params.branchId = branchId;
  if (medicineId) params.medicineId = medicineId;
  const { data } = await api.get("/inventory", { params });
  return data;
}

export async function getInventory(id: number): Promise<Inventory> {
  const { data } = await api.get(`/inventory/${id}`);
  return data;
}

export async function createInventory(input: { branchId: number; medicineId: number; stockCount: number; price: number }): Promise<Inventory> {
  const { data } = await api.post("/inventory", input);
  return data;
}

export async function updateInventory(id: number, input: { stockCount?: number; price?: number }): Promise<Inventory> {
  const { data } = await api.put(`/inventory/${id}`, input);
  return data;
}

export async function deleteInventory(id: number): Promise<void> {
  await api.delete(`/inventory/${id}`);
}

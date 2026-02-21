import api from "./api";
import type { PaginatedResponse, Pharmacy } from "../types";

export async function getAllPharmacies(page = 1, limit = 20): Promise<PaginatedResponse<Pharmacy>> {
  const { data } = await api.get("/pharmacies", { params: { page, limit } });
  return data;
}

export async function getPharmacy(id: number): Promise<Pharmacy> {
  const { data } = await api.get(`/pharmacies/${id}`);
  return data;
}

export async function createPharmacy(input: { name: string; logoUrl?: string | null }): Promise<Pharmacy> {
  const { data } = await api.post("/pharmacies", input);
  return data;
}

export async function updatePharmacy(id: number, input: Partial<{ name: string; logoUrl: string | null }>): Promise<Pharmacy> {
  const { data } = await api.put(`/pharmacies/${id}`, input);
  return data;
}

export async function deletePharmacy(id: number): Promise<void> {
  await api.delete(`/pharmacies/${id}`);
}

import api from "./api";
import type { PaginatedResponse, SearchResult, Medicine, AutocompleteResult } from "../types";

interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  sortBy?: string;
  availability?: string;
}

export async function searchMedicines(params: SearchParams): Promise<PaginatedResponse<SearchResult>> {
  const { data } = await api.get("/medicines/search", { params });
  return data;
}

export async function autocompleteMedicines(q: string): Promise<AutocompleteResult[]> {
  const { data } = await api.get("/medicines/autocomplete", { params: { q } });
  return data;
}

export async function getAllMedicines(page = 1, limit = 20): Promise<PaginatedResponse<Medicine>> {
  const { data } = await api.get("/medicines", { params: { page, limit } });
  return data;
}

export async function getMedicine(id: number): Promise<Medicine> {
  const { data } = await api.get(`/medicines/${id}`);
  return data;
}

export async function createMedicine(input: Omit<Medicine, "id">): Promise<Medicine> {
  const { data } = await api.post("/medicines", input);
  return data;
}

export async function updateMedicine(id: number, input: Partial<Medicine>): Promise<Medicine> {
  const { data } = await api.put(`/medicines/${id}`, input);
  return data;
}

export async function deleteMedicine(id: number): Promise<void> {
  await api.delete(`/medicines/${id}`);
}

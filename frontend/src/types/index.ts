export interface Pharmacy {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface Branch {
  id: number;
  pharmacyId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contactNumber: string | null;
  businessHours: string | null;
  pharmacy?: Pharmacy;
}

export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  description: string | null;
}

export interface Inventory {
  id: number;
  branchId: number;
  medicineId: number;
  stockCount: number;
  price: number;
  updatedAt: string;
  branch?: Branch & { pharmacy?: Pharmacy };
  medicine?: Medicine;
}

export interface SearchResult {
  medicine: Medicine;
  branch: Branch;
  pharmacy: Pharmacy;
  price: number;
  stockCount: number;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  distance: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface AutocompleteResult {
  id: number;
  name: string;
  genericName: string;
}

export type AvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock";

export function getAvailability(stockCount: number): AvailabilityStatus {
  if (stockCount === 0) return "Out of Stock";
  if (stockCount <= 10) return "Low Stock";
  return "In Stock";
}

export function getAvailabilityColor(status: AvailabilityStatus): string {
  switch (status) {
    case "In Stock":
      return "bg-emerald-100 text-emerald-800";
    case "Low Stock":
      return "bg-amber-100 text-amber-800";
    case "Out of Stock":
      return "bg-red-100 text-red-800";
  }
}

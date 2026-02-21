import { prisma } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";
import type { PaginationParams } from "../utils/pagination.js";
import { paginatedResponse } from "../utils/pagination.js";
import { haversineDistance } from "../utils/haversine.js";
import type { CreateMedicineInput, UpdateMedicineInput } from "../schemas/medicine.schema.js";

export async function search(
  query: string,
  params: PaginationParams,
  userLat?: number,
  userLng?: number,
  sortBy?: string,
  availability?: string
) {
  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { genericName: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      include: {
        inventory: {
          include: {
            branch: {
              include: {
                pharmacy: { select: { id: true, name: true, logoUrl: true } },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.medicine.count({ where }),
  ]);

  let results = medicines.flatMap((medicine) =>
    medicine.inventory.map((inv) => {
      const distance =
        userLat !== undefined && userLng !== undefined
          ? haversineDistance(userLat, userLng, inv.branch.latitude, inv.branch.longitude)
          : null;

      return {
        medicine: {
          id: medicine.id,
          name: medicine.name,
          genericName: medicine.genericName,
          description: medicine.description,
        },
        branch: {
          id: inv.branch.id,
          name: inv.branch.name,
          address: inv.branch.address,
          latitude: inv.branch.latitude,
          longitude: inv.branch.longitude,
          contactNumber: inv.branch.contactNumber,
          businessHours: inv.branch.businessHours,
        },
        pharmacy: inv.branch.pharmacy,
        price: inv.price,
        stockCount: inv.stockCount,
        availability: getAvailability(inv.stockCount),
        distance: distance ? Math.round(distance * 100) / 100 : null,
      };
    })
  );

  if (availability) {
    results = results.filter((r) => r.availability === availability);
  }

  if (sortBy === "price") {
    results.sort((a, b) => a.price - b.price);
  } else if (sortBy === "distance" && userLat !== undefined) {
    results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }

  return {
    data: results,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

export async function autocomplete(query: string) {
  if (!query || query.length < 2) return [];

  return prisma.medicine.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { genericName: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, genericName: true },
    take: 10,
    orderBy: { name: "asc" },
  });
}

export async function getAll(params: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.medicine.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { name: "asc" },
    }),
    prisma.medicine.count(),
  ]);

  return paginatedResponse(data, total, params);
}

export async function getById(id: number) {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      inventory: {
        include: {
          branch: {
            include: { pharmacy: { select: { id: true, name: true, logoUrl: true } } },
          },
        },
      },
    },
  });

  if (!medicine) throw new AppError(404, "Medicine not found");
  return medicine;
}

export async function create(input: CreateMedicineInput) {
  return prisma.medicine.create({ data: input });
}

export async function update(id: number, input: UpdateMedicineInput) {
  await getById(id);
  return prisma.medicine.update({ where: { id }, data: input });
}

export async function remove(id: number) {
  await getById(id);
  return prisma.medicine.delete({ where: { id } });
}

function getAvailability(stockCount: number): string {
  if (stockCount === 0) return "Out of Stock";
  if (stockCount <= 10) return "Low Stock";
  return "In Stock";
}

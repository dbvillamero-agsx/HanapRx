import { prisma } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";
import type { PaginationParams } from "../utils/pagination.js";
import { paginatedResponse } from "../utils/pagination.js";
import type { CreateInventoryInput, UpdateInventoryInput } from "../schemas/inventory.schema.js";

export async function getAll(params: PaginationParams, branchId?: number, medicineId?: number) {
  const where: Record<string, number> = {};
  if (branchId) where.branchId = branchId;
  if (medicineId) where.medicineId = medicineId;

  const [data, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      include: {
        branch: {
          include: { pharmacy: { select: { id: true, name: true } } },
        },
        medicine: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.inventory.count({ where }),
  ]);

  return paginatedResponse(data, total, params);
}

export async function getById(id: number) {
  const inventory = await prisma.inventory.findUnique({
    where: { id },
    include: {
      branch: { include: { pharmacy: true } },
      medicine: true,
    },
  });

  if (!inventory) throw new AppError(404, "Inventory record not found");
  return inventory;
}

export async function create(input: CreateInventoryInput) {
  const existing = await prisma.inventory.findUnique({
    where: {
      branchId_medicineId: {
        branchId: input.branchId,
        medicineId: input.medicineId,
      },
    },
  });

  if (existing) {
    throw new AppError(409, "Inventory record already exists for this branch and medicine");
  }

  return prisma.inventory.create({
    data: input,
    include: {
      branch: { include: { pharmacy: { select: { id: true, name: true } } } },
      medicine: true,
    },
  });
}

export async function update(id: number, input: UpdateInventoryInput) {
  await getById(id);
  return prisma.inventory.update({
    where: { id },
    data: input,
    include: {
      branch: { include: { pharmacy: { select: { id: true, name: true } } } },
      medicine: true,
    },
  });
}

export async function remove(id: number) {
  await getById(id);
  return prisma.inventory.delete({ where: { id } });
}

import { prisma } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";
import type { PaginationParams } from "../utils/pagination.js";
import { paginatedResponse } from "../utils/pagination.js";
import type { CreateBranchInput, UpdateBranchInput } from "../schemas/branch.schema.js";

export async function getAll(params: PaginationParams, pharmacyId?: number) {
  const where = pharmacyId ? { pharmacyId } : {};

  const [data, total] = await Promise.all([
    prisma.branch.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      include: { pharmacy: { select: { id: true, name: true, logoUrl: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.branch.count({ where }),
  ]);

  return paginatedResponse(data, total, params);
}

export async function getById(id: number) {
  const branch = await prisma.branch.findUnique({
    where: { id },
    include: {
      pharmacy: true,
      inventory: {
        include: { medicine: true },
        orderBy: { medicine: { name: "asc" } },
      },
    },
  });

  if (!branch) throw new AppError(404, "Branch not found");
  return branch;
}

export async function create(input: CreateBranchInput) {
  return prisma.branch.create({
    data: input,
    include: { pharmacy: { select: { id: true, name: true } } },
  });
}

export async function update(id: number, input: UpdateBranchInput) {
  await getById(id);
  return prisma.branch.update({
    where: { id },
    data: input,
    include: { pharmacy: { select: { id: true, name: true } } },
  });
}

export async function remove(id: number) {
  await getById(id);
  return prisma.branch.delete({ where: { id } });
}

import { prisma } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";
import type { PaginationParams } from "../utils/pagination.js";
import { paginatedResponse } from "../utils/pagination.js";
import type { CreatePharmacyInput, UpdatePharmacyInput } from "../schemas/pharmacy.schema.js";

export async function getAll(params: PaginationParams) {
  const [data, total] = await Promise.all([
    prisma.pharmacy.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      include: { _count: { select: { branches: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.pharmacy.count(),
  ]);

  return paginatedResponse(data, total, params);
}

export async function getById(id: number) {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id },
    include: { branches: true },
  });

  if (!pharmacy) throw new AppError(404, "Pharmacy not found");
  return pharmacy;
}

export async function create(input: CreatePharmacyInput) {
  return prisma.pharmacy.create({ data: input });
}

export async function update(id: number, input: UpdatePharmacyInput) {
  await getById(id);
  return prisma.pharmacy.update({ where: { id }, data: input });
}

export async function remove(id: number) {
  await getById(id);
  return prisma.pharmacy.delete({ where: { id } });
}

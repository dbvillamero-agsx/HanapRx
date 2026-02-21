import type { Request, Response, NextFunction } from "express";
import * as inventoryService from "../services/inventory.service.js";
import { parsePagination } from "../utils/pagination.js";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const params = parsePagination(req.query as Record<string, unknown>);
    const branchId = req.query.branchId
      ? parseInt(String(req.query.branchId), 10)
      : undefined;
    const medicineId = req.query.medicineId
      ? parseInt(String(req.query.medicineId), 10)
      : undefined;
    const result = await inventoryService.getAll(params, branchId, medicineId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const inventory = await inventoryService.getById(parseInt(String(req.params.id), 10));
    res.json(inventory);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const inventory = await inventoryService.create(req.body);
    res.status(201).json(inventory);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const inventory = await inventoryService.update(parseInt(String(req.params.id), 10), req.body);
    res.json(inventory);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await inventoryService.remove(parseInt(String(req.params.id), 10));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

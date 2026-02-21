import type { Request, Response, NextFunction } from "express";
import * as branchService from "../services/branch.service.js";
import { parsePagination } from "../utils/pagination.js";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const params = parsePagination(req.query as Record<string, unknown>);
    const pharmacyId = req.query.pharmacyId
      ? parseInt(String(req.query.pharmacyId), 10)
      : undefined;
    const result = await branchService.getAll(params, pharmacyId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const branch = await branchService.getById(parseInt(String(req.params.id), 10));
    res.json(branch);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const branch = await branchService.create(req.body);
    res.status(201).json(branch);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const branch = await branchService.update(parseInt(String(req.params.id), 10), req.body);
    res.json(branch);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await branchService.remove(parseInt(String(req.params.id), 10));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

import type { Request, Response, NextFunction } from "express";
import * as pharmacyService from "../services/pharmacy.service.js";
import { parsePagination } from "../utils/pagination.js";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const params = parsePagination(req.query as Record<string, unknown>);
    const result = await pharmacyService.getAll(params);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const pharmacy = await pharmacyService.getById(parseInt(String(req.params.id), 10));
    res.json(pharmacy);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const pharmacy = await pharmacyService.create(req.body);
    res.status(201).json(pharmacy);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const pharmacy = await pharmacyService.update(parseInt(String(req.params.id), 10), req.body);
    res.json(pharmacy);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await pharmacyService.remove(parseInt(String(req.params.id), 10));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

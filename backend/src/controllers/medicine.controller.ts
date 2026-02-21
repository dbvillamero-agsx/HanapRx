import type { Request, Response, NextFunction } from "express";
import * as medicineService from "../services/medicine.service.js";
import { parsePagination } from "../utils/pagination.js";

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const params = parsePagination(req.query as Record<string, unknown>);
    const query = String(req.query.q || "");
    const userLat = req.query.lat ? parseFloat(String(req.query.lat)) : undefined;
    const userLng = req.query.lng ? parseFloat(String(req.query.lng)) : undefined;
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
    const availability = req.query.availability ? String(req.query.availability) : undefined;

    const result = await medicineService.search(query, params, userLat, userLng, sortBy, availability);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function autocomplete(req: Request, res: Response, next: NextFunction) {
  try {
    const query = String(req.query.q || "");
    const results = await medicineService.autocomplete(query);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const params = parsePagination(req.query as Record<string, unknown>);
    const result = await medicineService.getAll(params);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const medicine = await medicineService.getById(parseInt(String(req.params.id), 10));
    res.json(medicine);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const medicine = await medicineService.create(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const medicine = await medicineService.update(parseInt(String(req.params.id), 10), req.body);
    res.json(medicine);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await medicineService.remove(parseInt(String(req.params.id), 10));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}


import { Request, Response } from 'express';
import { getAllCatalogsService } from '../services/catalog.service';

export const getAllCatalogsController = async (_req: Request, res: Response) => {
  try {
    const catalogs = await getAllCatalogsService();
    return res.json(catalogs);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
    return res.status(500).json({ message: "Error interno del servidor" });
};
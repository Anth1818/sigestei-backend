import { Request, Response } from "express";

/**
 * Crea un controlador estándar para obtener recursos por ID.
 * @param serviceFn Función del servicio que recibe un ID y retorna una promesa.
 * @param errorMessage Mensaje de error a mostrar si falla.
 */
export const createGetByIdController = (
  serviceFn: (id: number) => Promise<any>,
  errorMessage: string
) => {
  return async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const result = await serviceFn(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: errorMessage,
        error: error instanceof Error ? error.message : error,
      });
    }
  };
};
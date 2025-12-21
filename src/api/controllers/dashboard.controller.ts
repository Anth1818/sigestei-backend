import { Request, Response } from 'express';
import { getDashboardMetricsService } from '../services/dashboard.service';

export const getDashboardMetricsController = async (req: Request, res: Response) => {
  try { 
    const result = await getDashboardMetricsService();
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener métricas del dashboard',
      error: error instanceof Error ? error.message : error,
    });
  }
};

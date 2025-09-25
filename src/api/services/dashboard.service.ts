import { getDashboardMetricsRepository } from '../repositories/dashboard.repository';


export const getDashboardMetricsService = async () => {
  try {
    const rawData = await getDashboardMetricsRepository();

    
    return {
      success: true,
      data: {

        // Solicitudes del mes actual por estatus
        requestByStatusCurrentMonth: rawData.requestByStatusCurrentMonth,

        // Solicitudes resueltas por mes
        requestsCreatedAndResolvedByMonth: rawData.requestsCreatedAndResolvedByMonth,
        
        // Total de equipos y división por estatus
        equipment: rawData.totalEquipment,
        
        
        // Total de usuarios
       users: rawData.totalUsers,
       
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener métricas del dashboard',
    };
  }
};

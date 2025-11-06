import prisma from "../../config/db";

/**
 * Create a history record for a request change
 */
export const createRequestHistoryRepository = async (data: {
  request_id: number;
  change_type: 'priority' | 'status' | 'technician_assigned' | 'technician_reassigned';
  old_value: string | null;
  new_value: string | null;
  changed_by_id?: number | null;
  comments?: string | null;
}) => {
  try {
    const history = await prisma.request_history.create({
      data: {
        request_id: data.request_id,
        change_type: data.change_type,
        old_value: data.old_value,
        new_value: data.new_value,
        changed_by_id: data.changed_by_id || null,
        comments: data.comments || null,
      },
    });

    return history;
  } catch (error) {
    console.error("Error in createRequestHistoryRepository:", error);
    throw new Error("Error creating request history record");
  }
};

/**
 * Get all history records for a specific request
 */
export const getRequestHistoryRepository = async (requestId: number) => {
  try {
    const history = await prisma.request_history.findMany({
      where: { request_id: requestId },
      include: {
        changed_by: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role_id: true,
          },
        },
      },
      orderBy: {
        changed_at: "desc",
      },
    });

    return history;
  } catch (error) {
    console.error("Error in getRequestHistoryRepository:", error);
    throw new Error("Error fetching request history");
  }
};

/**
 * Get history records by change type
 */
export const getRequestHistoryByTypeRepository = async (
  requestId: number,
  changeType: 'priority' | 'status' | 'technician_assigned' | 'technician_reassigned'
) => {
  try {
    const history = await prisma.request_history.findMany({
      where: {
        request_id: requestId,
        change_type: changeType,
      },
      include: {
        changed_by: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: {
        changed_at: "desc",
      },
    });

    return history;
  } catch (error) {
    console.error("Error in getRequestHistoryByTypeRepository:", error);
    throw new Error("Error fetching request history by type");
  }
};

/**
 * Get all changes made by a specific user
 */
export const getHistoryByUserRepository = async (userId: number) => {
  try {
    const history = await prisma.request_history.findMany({
      where: { changed_by_id: userId },
      include: {
        requests: {
          select: {
            id: true,
            description: true,
          },
        },
      },
      orderBy: {
        changed_at: "desc",
      },
    });

    return history;
  } catch (error) {
    console.error("Error in getHistoryByUserRepository:", error);
    throw new Error("Error fetching history by user");
  }
};

# Ejemplos de Uso del Sistema de Auditoría

Este documento muestra cómo integrar la auditoría en los servicios existentes.

## 1. Auditoría de Login de Usuarios

### En `auth.service.ts` (Login)

```typescript
import { PrismaClient } from '../generated/prisma/index.js';
import { logUserLogin } from '../middlewares/auditMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (email: string, password: string, ipAddress: string, userAgent: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      // Registrar intento fallido
      await logUserLogin(0, ipAddress, userAgent, false, 'Usuario no encontrado');
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Registrar intento fallido
      await logUserLogin(user.id, ipAddress, userAgent, false, 'Contraseña incorrecta');
      throw new Error('Credenciales inválidas');
    }

    // Registrar login exitoso
    await logUserLogin(user.id, ipAddress, userAgent, true);

    // Actualizar last_login
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login: new Date() }
    });

    const token = jwt.sign({ userId: user.id, roleId: user.role_id }, process.env.JWT_SECRET!, {
      expiresIn: '24h'
    });

    return { token, user };
  } catch (error) {
    throw error;
  }
};
```

### En `auth.controller.ts`

```typescript
import { Request, Response } from 'express';
import { login } from '../services/auth.service.js';

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || null;
    const userAgent = req.get('User-Agent') || null;

    const result = await login(email, password, ipAddress, userAgent);
    
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
```

---

## 2. Auditoría de Solicitudes (Requests)

### Cambio de Estado en `request.service.ts`

```typescript
import { PrismaClient } from '../generated/prisma/index.js';
import { logRequestStatusChange } from '../middlewares/auditMiddleware.js';

const prisma = new PrismaClient();

export const updateRequestStatus = async (
  requestId: number,
  newStatusId: number,
  userId: number,
  comments?: string
) => {
  // Obtener el estado actual
  const currentRequest = await prisma.requests.findUnique({
    where: { id: requestId },
    select: { status_id: true }
  });

  if (!currentRequest) {
    throw new Error('Solicitud no encontrada');
  }

  // Actualizar el estado
  const updatedRequest = await prisma.requests.update({
    where: { id: requestId },
    data: { 
      status_id: newStatusId,
      resolution_date: newStatusId === 3 ? new Date() : null // 3 = Resuelta
    }
  });

  // Registrar en auditoría
  await logRequestStatusChange(
    requestId,
    currentRequest.status_id,
    newStatusId,
    userId,
    comments
  );

  return updatedRequest;
};
```

### Asignación de Técnico en `request.service.ts`

```typescript
import { logTechnicianAssignment } from '../middlewares/auditMiddleware.js';

export const assignTechnician = async (
  requestId: number,
  technicianId: number,
  assignedById: number,
  reason?: string
) => {
  // Obtener técnico actual
  const currentRequest = await prisma.requests.findUnique({
    where: { id: requestId },
    select: { technician_id: true }
  });

  if (!currentRequest) {
    throw new Error('Solicitud no encontrada');
  }

  // Actualizar técnico
  const updatedRequest = await prisma.requests.update({
    where: { id: requestId },
    data: { technician_id: technicianId }
  });

  // Registrar asignación en tabla específica de auditoría
  await logTechnicianAssignment(
    requestId,
    technicianId,
    currentRequest.technician_id,
    assignedById,
    reason
  );

  return updatedRequest;
};
```

### Cambio de Prioridad en `request.service.ts`

```typescript
import { logRequestPriorityChange } from '../middlewares/auditMiddleware.js';

export const updateRequestPriority = async (
  requestId: number,
  newPriorityId: number,
  userId: number,
  comments?: string
) => {
  const currentRequest = await prisma.requests.findUnique({
    where: { id: requestId },
    select: { priority_id: true }
  });

  if (!currentRequest) {
    throw new Error('Solicitud no encontrada');
  }

  const updatedRequest = await prisma.requests.update({
    where: { id: requestId },
    data: { priority_id: newPriorityId }
  });

  await logRequestPriorityChange(
    requestId,
    currentRequest.priority_id,
    newPriorityId,
    userId,
    comments
  );

  return updatedRequest;
};
```

---

## 3. Auditoría de Equipos

### Asignación de Equipo a Usuario en `equipment.service.ts`

```typescript
import { PrismaClient } from '../generated/prisma/index.js';
import { logEquipmentAssignment } from '../middlewares/auditMiddleware.js';

const prisma = new PrismaClient();

export const assignEquipmentToUser = async (
  equipmentId: number,
  userId: number,
  assignedById: number,
  reason?: string
) => {
  // Obtener datos actuales del equipo
  const currentEquipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    select: { 
      assigned_user_id: true,
      location: true 
    }
  });

  if (!currentEquipment) {
    throw new Error('Equipo no encontrado');
  }

  // Obtener información del nuevo usuario para actualizar location
  const newUser = await prisma.users.findUnique({
    where: { id: userId },
    select: { 
      full_name: true,
      departments: {
        select: { name: true }
      }
    }
  });

  const newLocation = `${newUser?.departments?.name || 'Sin departamento'} - ${newUser?.full_name}`;

  // Actualizar equipo
  const updatedEquipment = await prisma.equipment.update({
    where: { id: equipmentId },
    data: { 
      assigned_user_id: userId,
      location: newLocation
    }
  });

  // Registrar asignación en auditoría
  await logEquipmentAssignment(
    equipmentId,
    userId,
    currentEquipment.assigned_user_id,
    newLocation,
    currentEquipment.location,
    assignedById,
    reason
  );

  return updatedEquipment;
};
```

### Cambio de Ubicación (sin cambiar usuario asignado)

```typescript
export const updateEquipmentLocation = async (
  equipmentId: number,
  newLocation: string,
  updatedById: number,
  reason?: string
) => {
  const currentEquipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    select: { 
      location: true,
      assigned_user_id: true 
    }
  });

  if (!currentEquipment) {
    throw new Error('Equipo no encontrado');
  }

  const updatedEquipment = await prisma.equipment.update({
    where: { id: equipmentId },
    data: { location: newLocation }
  });

  // Registrar cambio de ubicación
  await logEquipmentAssignment(
    equipmentId,
    currentEquipment.assigned_user_id,
    currentEquipment.assigned_user_id, // Mismo usuario
    newLocation,
    currentEquipment.location,
    updatedById,
    reason || 'Cambio de ubicación física'
  );

  return updatedEquipment;
};
```

### Cambio de Estado de Equipo

```typescript
import { logEquipmentStatusChange } from '../middlewares/auditMiddleware.js';

export const updateEquipmentStatus = async (
  equipmentId: number,
  newStatusId: number,
  userId: number,
  comments?: string
) => {
  const currentEquipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    select: { status_id: true }
  });

  if (!currentEquipment) {
    throw new Error('Equipo no encontrado');
  }

  const updatedEquipment = await prisma.equipment.update({
    where: { id: equipmentId },
    data: { status_id: newStatusId }
  });

  await logEquipmentStatusChange(
    equipmentId,
    currentEquipment.status_id,
    newStatusId,
    userId,
    comments
  );

  return updatedEquipment;
};
```

---

## 4. Auditoría de Usuarios

### Desactivar Usuario en `user.service.ts`

```typescript
import { PrismaClient } from '../generated/prisma/index.js';
import { logUserActivationChange } from '../middlewares/auditMiddleware.js';

const prisma = new PrismaClient();

export const deactivateUser = async (
  userId: number,
  deactivatedById: number,
  reason?: string
) => {
  const currentUser = await prisma.users.findUnique({
    where: { id: userId },
    select: { is_active: true }
  });

  if (!currentUser) {
    throw new Error('Usuario no encontrado');
  }

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: { is_active: false }
  });

  await logUserActivationChange(
    userId,
    currentUser.is_active!,
    false,
    deactivatedById,
    reason
  );

  return updatedUser;
};
```

### Cambiar Rol de Usuario

```typescript
import { logUserRoleChange } from '../middlewares/auditMiddleware.js';

export const updateUserRole = async (
  userId: number,
  newRoleId: number,
  changedById: number,
  reason?: string
) => {
  const currentUser = await prisma.users.findUnique({
    where: { id: userId },
    select: { role_id: true }
  });

  if (!currentUser) {
    throw new Error('Usuario no encontrado');
  }

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: { role_id: newRoleId }
  });

  await logUserRoleChange(
    userId,
    currentUser.role_id,
    newRoleId,
    changedById,
    reason
  );

  return updatedUser;
};
```

---

## 5. Consultas de Auditoría

### Obtener historial de una solicitud

```typescript
export const getRequestAuditHistory = async (requestId: number) => {
  const [statusChanges, technicianAssignments] = await Promise.all([
    // Cambios genéricos (estado, prioridad, etc.)
    prisma.audit_log.findMany({
      where: {
        entity_type: 'request',
        entity_id: requestId
      },
      include: {
        changed_by: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      },
      orderBy: { changed_at: 'desc' }
    }),
    
    // Asignaciones de técnicos
    prisma.request_technician_assignments.findMany({
      where: { request_id: requestId },
      include: {
        technician: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        previous_technician: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        assigned_by: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      },
      orderBy: { assigned_at: 'desc' }
    })
  ]);

  return {
    statusChanges,
    technicianAssignments
  };
};
```

### Obtener historial de un equipo

```typescript
export const getEquipmentAuditHistory = async (equipmentId: number) => {
  const [statusChanges, assignments] = await Promise.all([
    prisma.audit_log.findMany({
      where: {
        entity_type: 'equipment',
        entity_id: equipmentId
      },
      include: {
        changed_by: {
          select: {
            id: true,
            full_name: true
          }
        }
      },
      orderBy: { changed_at: 'desc' }
    }),
    
    prisma.equipment_assignments.findMany({
      where: { equipment_id: equipmentId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true
          }
        },
        previous_user: {
          select: {
            id: true,
            full_name: true
          }
        },
        assigned_by: {
          select: {
            id: true,
            full_name: true
          }
        }
      },
      orderBy: { assigned_at: 'desc' }
    })
  ]);

  return {
    statusChanges,
    assignments
  };
};
```

### Obtener historial de logins de un usuario

```typescript
export const getUserLoginHistory = async (userId: number, limit: number = 20) => {
  return await prisma.user_logins.findMany({
    where: { user_id: userId },
    orderBy: { login_at: 'desc' },
    take: limit
  });
};
```

### Obtener cambios recientes (Dashboard de auditoría)

```typescript
export const getRecentAuditLogs = async (limit: number = 50) => {
  return await prisma.audit_log.findMany({
    include: {
      changed_by: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: { changed_at: 'desc' },
    take: limit
  });
};
```

---

## Resumen de Tablas de Auditoría

### 1. **`request_technician_assignments`**
- Registra asignaciones y reasignaciones de técnicos a solicitudes
- Campos clave: `technician_id`, `previous_technician_id`, `assigned_by_id`, `reason`

### 2. **`equipment_assignments`**
- Registra asignaciones de equipos a usuarios y cambios de ubicación
- Campos clave: `user_id`, `previous_user_id`, `location`, `previous_location`, `assigned_by_id`

### 3. **`user_logins`**
- Registra todos los intentos de login (exitosos y fallidos)
- Campos clave: `user_id`, `ip_address`, `user_agent`, `success`, `failure_reason`

### 4. **`audit_log`** (genérica)
- Registra cambios de estado, prioridades, desactivaciones, cambios de rol, etc.
- Campos clave: `entity_type`, `entity_id`, `change_type`, `field_name`, `old_value`, `new_value`

---

## Buenas Prácticas

1. **Siempre registrar en auditoría DESPUÉS de la operación principal**
2. **No lanzar errores desde las funciones de auditoría** (usar try-catch interno)
3. **Incluir información contextual** (comentarios, razón del cambio)
4. **Capturar IP y User-Agent en logins**
5. **Usar transacciones si es crítico** que la auditoría se registre junto con el cambio

### Ejemplo con Transacción

```typescript
export const criticalUpdate = async (requestId: number, newStatusId: number, userId: number) => {
  return await prisma.$transaction(async (tx) => {
    const currentRequest = await tx.requests.findUnique({
      where: { id: requestId },
      select: { status_id: true }
    });

    const updated = await tx.requests.update({
      where: { id: requestId },
      data: { status_id: newStatusId }
    });

    await tx.audit_log.create({
      data: {
        entity_type: 'request',
        entity_id: requestId,
        change_type: 'status_changed',
        field_name: 'status_id',
        old_value: String(currentRequest!.status_id),
        new_value: String(newStatusId),
        changed_by_id: userId
      }
    });

    return updated;
  });
};
```

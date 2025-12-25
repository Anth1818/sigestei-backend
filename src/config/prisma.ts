import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables del .env

// Crear el adapter de PostgreSQL (requerido en Prisma 7.x)
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});

export const prisma = new PrismaClient({ adapter });


import type { Empleado } from '@/types';

import {
  findAllEmpleados,
  createEmpleado,
  updateEmpleado,
} from '@/repositories/empleadoRepository';

// ==================== GET ====================
export async function getEmpleados(): Promise<
  Empleado[]
> {
  const { data, error } =
    await findAllEmpleados();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// ==================== CREATE ====================
export async function crearEmpleado(
  payload: Omit<Empleado, 'id'>
): Promise<Empleado> {
  const { data, error } =
    await createEmpleado(payload);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ==================== UPDATE ====================
export async function actualizarEmpleado(
  id: string,
  payload: Partial<Empleado>
): Promise<Empleado> {
  const { data, error } =
    await updateEmpleado(id, payload);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
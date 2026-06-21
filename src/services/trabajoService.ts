// trabajo.service.ts

import { getCurrentEmpleado } from '@/repositories/authRepository';
import {
  findAllTrabajos,
  findTrabajoById,
  createTrabajo,
  updateTrabajo,
} from '../repositories/trabajoRepository';

import type {
  Trabajo,
  CreateTrabajoPayload,
} from '@/types';

export async function getTrabajos() {
  const { data, error } =
    await findAllTrabajos();

  if (error) throw error;

  return data;
}

export async function getTrabajoById(id: string) {
  const { data, error } = await findTrabajoById(id);

  if (error) throw error;

  if (!data) {
    throw new Error("Trabajo no encontrado");
  }

  return data;
}


export async function createTrabajoService(
  payload: CreateTrabajoPayload
) {

  if (!payload.vehiculo_id) {
    throw new Error(
      'Debe seleccionar un vehículo'
    );
  }

  const { data: adminData, error: adminError } =
    await getCurrentEmpleado();
  
  if (adminError || !adminData) {
    throw new Error('No se pudo obtener el empleado logueado');
  }

  const { data, error } =
    await createTrabajo({
      ...payload,
      taller_id: adminData.taller_id,
      estado:
        payload.estado ??
        'Pendiente',
    });

  if (error) throw error;

  return data;
}

export async function updateTrabajoService(
  id: string,
  payload: Partial<Trabajo>
) {
  const { data, error } =
    await updateTrabajo(
      id,
      payload
    );

  if (error) throw error;

  return data;
}


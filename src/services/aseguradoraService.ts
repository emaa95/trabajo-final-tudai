import {
  findAllAseguradoras,
  findAseguradoraById,
  createAseguradora,
  updateAseguradora,
  deleteAseguradora,
} from '@/repositories/aseguradoraRepository';

import type { Aseguradora } from '@/types';

export async function getAseguradorasService() {
  const { data, error } = await findAllAseguradoras();
  if (error) throw error;
  return data;
}

export async function getAseguradoraByIdService(id: string) {
  const { data, error } = await findAseguradoraById(id);
  if (error) throw error;
  return data;
}

export async function createAseguradoraService(payload: {
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  cuit?: string;
}) {
  if (!payload.nombre || payload.nombre.trim().length < 2) {
    throw new Error('Nombre inválido');
  }

  const { data, error } = await createAseguradora({
    ...payload,
    nombre: payload.nombre.trim(),
  });

  if (error) throw error;
  return data;
}

export async function updateAseguradoraService(
  id: string,
  payload: Partial<Aseguradora>
) {
  const { data, error } = await updateAseguradora(id, payload);
  if (error) throw error;
  return data;
}

export async function deleteAseguradoraService(id: string) {
  const { data, error } = await deleteAseguradora(id);
  if (error) throw error;
  return data;
}
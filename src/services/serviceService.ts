import {
  findAllServices,
  findServiceById,
  findServiceByTrabajoId,
  createService,
  updateService,
} from '@/repositories/serviceRepository';

import type {
  Service,
  CreateServicioDto,
  UpdateServicioDto,
} from '@/types';

export async function getServicesService() {
  const { data, error } = await findAllServices();

  if (error) throw error;

  return data as Service[];
}

export async function getServiceByIdService(id: string) {
  if (!id) throw new Error('ID inválido');

  const { data, error } = await findServiceById(id);

  if (error) throw error;

  return data as Service;
}

export async function getServiceByTrabajoIdService(
  trabajo_id: string
) {
  if (!trabajo_id) throw new Error('trabajo_id inválido');

  const { data, error } =
    await findServiceByTrabajoId(trabajo_id);

  if (error) throw error;

  return data;
}

export async function createServiceService(
  payload: CreateServicioDto
) {
  if (!payload.trabajo_id) {
    throw new Error('trabajo_id es obligatorio');
  }

  const { data, error } = await createService({
    trabajo_id: payload.trabajo_id,
    kilometraje_actual: payload.kilometraje_actual ?? null,
    aceite_utilizado: payload.aceite_utilizado ?? null,
    proximo_service_km: payload.proximo_service_km ?? null,
    proxima_fecha_service: payload.proxima_fecha_service ?? null,
    observaciones: payload.observaciones ?? null,
  });

  if (error) throw error;

  return data as Service;
}

export async function updateServiceService(
  id: string,
  payload: UpdateServicioDto
) {
  if (!id) throw new Error('ID inválido');

  const { data, error } = await updateService(id, payload);

  if (error) throw error;

  return data as Service;
}
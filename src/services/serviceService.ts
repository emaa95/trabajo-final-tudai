import {
  findAllServices,
  findServiceById,
  findServiceByTrabajoId,
  createService,
  updateService,
} from "@/repositories/serviceRepository";

import type {
  Service,
  ServiceDetalle,
  CreateServicioDto,
  UpdateServicioDto,
} from "@/types";

export async function getServicesService() {
  const { data, error } =
    await findAllServices();

  if (error) throw error;

  return data as ServiceDetalle[];
}

export async function getServiceByIdService(
  id: string
) {
  if (!id) {
    throw new Error("ID inválido");
  }

  const { data, error } =
    await findServiceById(id);

  if (error) throw error;

  if (!data) {
    throw new Error("Service no encontrado");
  }

  return data as ServiceDetalle;
}

export async function getServiceByTrabajoIdService(
  trabajoId: string
) {
  if (!trabajoId) {
    throw new Error("trabajo_id inválido");
  }

  const { data, error } =
    await findServiceByTrabajoId(trabajoId);

  if (error) throw error;

  if (!data) {
    throw new Error("Service no encontrado");
  }

  return data as ServiceDetalle;
}

export async function createServiceService(
  payload: CreateServicioDto
) {
  if (!payload.trabajo_id) {
    throw new Error(
      "trabajo_id es obligatorio"
    );
  }

  const { data, error } =
    await createService(payload);

  if (error) throw error;

  if (!data) {
    throw new Error(
      "No se pudo crear el service"
    );
  }

  const serviceCompleto =
    await getServiceByIdService(data.id);

  return serviceCompleto;
}

export async function updateServiceService(
  id: string,
  payload: UpdateServicioDto
) {
  if (!id) {
    throw new Error("ID inválido");
  }

  const { data, error } =
    await updateService(
      id,
      payload
    );

  if (error) throw error;

  if (!data) {
    throw new Error(
      "No se pudo actualizar el service"
    );
  }

  const serviceCompleto =
    await getServiceByIdService(data.id);

  return serviceCompleto;
}
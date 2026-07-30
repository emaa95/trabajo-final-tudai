import {
  findRepuestosByServiceId,
  createServiceRepuesto,
  updateServiceRepuesto,
  deleteServiceRepuesto,
} from "@/repositories/serviceRepuestosRepository";

import type {
  ServiceRepuesto,
  CreateServiceRepuestoDto,
  UpdateServiceRepuestoDto,
  EstadoTrabajo,
} from "@/types";

import {
  ESTADOS_TRABAJO_BLOQUEADOS,
} from "@/types";


export async function getRepuestosByServiceIdService(
  serviceId: string,
) {
  if (!serviceId) {
    throw new Error("service_id inválido");
  }

  const { data, error } =
    await findRepuestosByServiceId(serviceId);

  if (error) throw error;

  return data as ServiceRepuesto[];
}


export async function createServiceRepuestoService(
  payload: CreateServiceRepuestoDto,
) {
  if (!payload.service_id) {
    throw new Error("service_id es obligatorio");
  }

  if (!payload.descripcion) {
    throw new Error("descripcion es obligatoria");
  }

  if (!payload.cantidad || payload.cantidad <= 0) {
    throw new Error("cantidad inválida");
  }

  const { data, error } =
    await createServiceRepuesto(payload);

  if (error) throw error;

  return data as ServiceRepuesto;
}


export async function updateServiceRepuestoService(
  id: string,
  payload: UpdateServiceRepuestoDto,
) {
  if (!id) {
    throw new Error("ID inválido");
  }

  const { data, error } =
    await updateServiceRepuesto(
      id,
      payload,
    );

  if (error) throw error;

  return data as ServiceRepuesto;
}


export async function deleteServiceRepuestoService(
  id: string,
  estadoTrabajo: EstadoTrabajo,
) {
  if (!id) {
    throw new Error("ID inválido");
  }


  if (
    ESTADOS_TRABAJO_BLOQUEADOS.includes(
      estadoTrabajo,
    )
  ) {
    throw new Error(
      "No se pueden eliminar repuestos en una orden de trabajo cerrada",
    );
  }


  const { error } =
    await deleteServiceRepuesto(id);


  if (error) {
    throw error;
  }
}
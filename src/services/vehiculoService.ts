import type {
  Vehiculo,
  CreateVehiculoDto,
  UpdateVehiculoDto,
} from "@/types";

import {
  findAllVehiculos,
  findVehiculoById,
  findVehiculosByCliente,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from "@/repositories/vehiculoRepository";

import { getCurrentEmpleado } from "@/repositories/authRepository";

// ======================================================
// GET ALL
// ======================================================

export async function getVehiculos(): Promise<Vehiculo[]> {
  const { data, error } = await findAllVehiculos();

  if (error) {
    console.error("[VEHICULOS_SERVICE][GET_ALL]", error);
    throw new Error("No se pudieron obtener los vehículos");
  }

  return data ?? [];
}

// ======================================================
// GET BY ID
// ======================================================

export async function getVehiculoById(id: string): Promise<Vehiculo> {
  if (!id) throw new Error("El ID del vehículo es obligatorio");

  const { data, error } = await findVehiculoById(id);

  if (error) {
    console.error("[VEHICULOS_SERVICE][GET_BY_ID]", error);
    throw new Error("No se pudo obtener el vehículo");
  }

  return data;
}

// ======================================================
// GET BY CLIENTE
// ======================================================

export async function getVehiculosByCliente(
  clienteId: string
): Promise<Vehiculo[]> {
  if (!clienteId) throw new Error("El ID del cliente es obligatorio");

  const { data, error } = await findVehiculosByCliente(clienteId);

  if (error) {
    console.error("[VEHICULOS_SERVICE][GET_BY_CLIENTE]", error);
    throw new Error("No se pudieron obtener los vehículos del cliente");
  }

  return data ?? [];
}

// ======================================================
// CREATE
// ======================================================

export async function crearVehiculo(
  payload: CreateVehiculoDto
): Promise<void> {
  if (!payload.patente?.trim()) {
    throw new Error("La patente es obligatoria");
  }

  const { data: empleado, error } = await getCurrentEmpleado();

  if (error || !empleado) {
    throw new Error("No se pudo obtener el empleado logueado");
  }

  const vehiculoNormalizado = normalizarVehiculo(
    payload,
    empleado.taller_id
  );

  const { error: createError } = await createVehiculo(
    vehiculoNormalizado
  );

  if (createError) {
    console.error("[VEHICULOS_SERVICE][CREATE]", createError);
    manejarErrorSupabase(createError);
  }
}

// ======================================================
// UPDATE
// ======================================================

export async function actualizarVehiculo(
  id: string,
  payload: UpdateVehiculoDto
): Promise<Vehiculo> {
  if (!id) throw new Error("El ID del vehículo es obligatorio");

  const { data, error } = await updateVehiculo(
    id,
    normalizarUpdateVehiculo(payload)
  );

  if (error) {
    console.error("[VEHICULOS_SERVICE][UPDATE]", error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// DELETE
// ======================================================

export async function eliminarVehiculo(id: string): Promise<void> {
  if (!id) {
    throw new Error("El ID del vehículo es obligatorio");
  }

  const { data, error } = await deleteVehiculo(id);

  console.log("[DELETE VEHICULO RESPONSE]", {
    data,
    error,
  });

  if (error) {
    console.error("[VEHICULOS_SERVICE][DELETE]", error);
    manejarErrorSupabase(error);
  }

  if (!data) {
    throw new Error("No se encontró el vehículo a eliminar");
  }
}

// ======================================================
// NORMALIZACIÓN
// ======================================================

function normalizarVehiculo(
  payload: CreateVehiculoDto,
  taller_id: string
): CreateVehiculoDto {
  return {
    ...payload,
    taller_id,
    patente: payload.patente.trim().toUpperCase(),
    marca: payload.marca?.trim(),
    modelo: payload.modelo?.trim(),
  };
}

function normalizarUpdateVehiculo(
  payload: UpdateVehiculoDto
): UpdateVehiculoDto {
  return {
    ...payload,
    patente: payload.patente?.trim().toUpperCase(),
    marca: payload.marca?.trim(),
    modelo: payload.modelo?.trim(),
  };
}

// ======================================================
// ERROR HANDLER
// ======================================================

function manejarErrorSupabase(error: {
  code?: string;
  message: string;
}): never {
  if (error.code === "23505") {
    throw new Error("Ya existe un vehículo con esos datos");
  }

  if (error.code === "23503") {
    throw new Error("Relación inválida en los datos");
  }

  if (error.code === "PGRST116") {
    throw new Error("Vehículo no encontrado");
  }

  throw new Error(error.message);
}
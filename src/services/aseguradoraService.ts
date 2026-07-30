import {
  findAllAseguradoras,
  findAseguradoraById,
  createAseguradora,
  updateAseguradora,
  deleteAseguradora,
} from "@/repositories/aseguradoraRepository";

import { getCurrentEmpleado } from "@/repositories/authRepository";

import type { Aseguradora } from "@/types";

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

// ======================================================
// CREATE
// ======================================================

export async function createAseguradoraService(payload: {
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  cuit?: string;
}) {
  if (!payload.nombre || payload.nombre.trim().length < 2) {
    throw new Error("Nombre inválido");
  }

  const { data: empleado, error: empleadoError } = await getCurrentEmpleado();

  if (empleadoError || !empleado) {
    throw new Error("No se pudo obtener el empleado logueado");
  }

  const aseguradoraNormalizada = normalizarAseguradora(
    payload,
    empleado.taller_id
  );

  const { data, error } = await createAseguradora(
    aseguradoraNormalizada
  );

  if (error) {
    console.error("[ASEGURADORAS_SERVICE][CREATE]", error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// UPDATE
// ======================================================

export async function updateAseguradoraService(
  id: string,
  payload: Partial<Aseguradora>
) {
  const { data, error } = await updateAseguradora(id, payload);

  if (error) {
    console.error("[ASEGURADORAS_SERVICE][UPDATE]", error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// DELETE
// ======================================================

export async function deleteAseguradoraService(id: string) {
  const { data, error } = await deleteAseguradora(id);

  if (error) {
    console.error("[ASEGURADORAS_SERVICE][DELETE]", error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// NORMALIZACIÓN
// ======================================================

function normalizarAseguradora(
  payload: {
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    cuit?: string;
  },
  taller_id: string
) {
  return {
    ...payload,
    taller_id,
    nombre: payload.nombre.trim(),
    telefono: payload.telefono?.trim(),
    email: payload.email?.trim(),
    direccion: payload.direccion?.trim(),
    cuit: payload.cuit?.trim(),
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
    throw new Error("Ya existe una aseguradora con esos datos");
  }

  if (error.code === "23503") {
    throw new Error("Relación inválida en los datos");
  }

  if (error.code === "PGRST116") {
    throw new Error("Aseguradora no encontrada");
  }

  throw new Error(error.message);
}
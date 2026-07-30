import { getCurrentEmpleado } from "@/repositories/authRepository";

import {
  findAllTrabajos,
  findTrabajoById,
  findTrabajosByVehiculo,
  createTrabajo,
  updateTrabajo,
} from "../repositories/trabajoRepository";

import type {
  Trabajo,
  CreateTrabajoPayload,
} from "@/types";


// ======================================================
// GET ALL
// ======================================================

export async function getTrabajos() {
  const {
    data,
    error,
  } = await findAllTrabajos();

  if (error) throw error;

  return data;
}


// ======================================================
// GET BY ID
// ======================================================

export async function getTrabajoById(
  id: string
) {
  const {
    data,
    error,
  } = await findTrabajoById(id);

  if (error) throw error;

  if (!data) {
    throw new Error(
      "Trabajo no encontrado"
    );
  }

  return data;
}


// ======================================================
// GET BY VEHICULO
// ======================================================

export async function getTrabajosByVehiculo(
  vehiculoId: string
) {
  const {
    data,
    error,
  } = await findTrabajosByVehiculo(
    vehiculoId
  );

  if (error) throw error;

  return data;
}


// ======================================================
// CREATE
// ======================================================

export async function createTrabajoService(
  payload: CreateTrabajoPayload
) {

  console.log(
    "SERVICE START",
    payload
  );


  if (!payload.vehiculo_id) {
    throw new Error(
      "Debe seleccionar un vehículo"
    );
  }


  console.log(
    "VEHICULO OK"
  );


  const {
    data: adminData,
    error: adminError,
  } = await getCurrentEmpleado();


  console.log(
    "EMPLEADO:",
    {
      adminData,
      adminError,
    }
  );


  if (
    adminError ||
    !adminData
  ) {
    throw new Error(
      "No se pudo obtener el empleado logueado"
    );
  }


  console.log(
    "ANTES CREATE REPOSITORY"
  );


  const data = await createTrabajo({
    ...payload,
    taller_id: adminData.taller_id,
    estado:
      payload.estado ??
      "Pendiente",
  });


  console.log(
    "DESPUES CREATE REPOSITORY",
    data
  );


  if (!data) {
    throw new Error(
      "No se pudo crear la orden de trabajo"
    );
  }


  const trabajoCompleto =
    await getTrabajoById(
      data.id
    );


  console.log(
    "TRABAJO COMPLETO",
    trabajoCompleto
  );


  return trabajoCompleto;
}


// ======================================================
// UPDATE
// ======================================================

export async function updateTrabajoService(
  id: string,
  payload: Partial<Trabajo>
) {

  const {
    data,
    error,
  } = await updateTrabajo(
    id,
    payload
  );


  if (error) throw error;

  return data;
}
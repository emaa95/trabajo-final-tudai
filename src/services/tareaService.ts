import {
  findTareasByTrabajo,
  createTarea,
  updateTarea,
  deleteTarea,
} from "@/repositories/tareaRepository";

import type {
  Tarea,
} from "@/types";


// ======================================================
// GET BY TRABAJO
// ======================================================

export async function getTareasByTrabajo(
  trabajoId: string
) {

  const {
    data,
    error,
  } = await findTareasByTrabajo(
    trabajoId
  );


  if (error) throw error;


  return data;
}



// ======================================================
// CREATE
// ======================================================

export async function createTareaService(
  payload: Omit<Tarea, "id" | "created_at">
) {

  if (!payload.trabajo_id) {
    throw new Error(
      "La tarea debe pertenecer a un trabajo"
    );
  }


  if (!payload.titulo.trim()) {
    throw new Error(
      "El título de la tarea es obligatorio"
    );
  }


  if (payload.costo < 0) {
    throw new Error(
      "El costo no puede ser negativo"
    );
  }


  const {
    data,
    error,
  } = await createTarea(
    {
      ...payload,
      realizada:
        payload.realizada ?? false,
    }
  );


  if (error) throw error;


  return data;
}



// ======================================================
// UPDATE
// ======================================================

export async function updateTareaService(
  id: string,
  payload: Partial<Tarea>
) {

  const {
    data,
    error,
  } = await updateTarea(
    id,
    payload
  );


  if (error) throw error;


  return data;
}



// ======================================================
// DELETE
// ======================================================

export async function deleteTareaService(
  id: string
) {

  const {
    error,
  } = await deleteTarea(
    id
  );


  if (error) throw error;


  return true;
}
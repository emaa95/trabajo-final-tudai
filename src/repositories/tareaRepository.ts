import { supabase } from "@/lib/supabase";
import type { Tarea } from "@/types";


// ======================================================
// GET BY TRABAJO
// ======================================================

export async function findTareasByTrabajo(
  trabajoId: string
) {
  return supabase
    .from("TAREAS")
    .select("*")
    .eq("trabajo_id", trabajoId)
    .order("created_at", {
      ascending: true,
    });
}


// ======================================================
// CREATE
// ======================================================

export async function createTarea(
  payload: Omit<Tarea, "id" | "created_at">
) {
  return supabase
    .from("TAREAS")
    .insert(payload)
    .select("*")
    .single();
}


// ======================================================
// UPDATE
// ======================================================

export async function updateTarea(
  id: string,
  payload: Partial<Tarea>
) {
  return supabase
    .from("TAREAS")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
}


// ======================================================
// DELETE
// ======================================================

export async function deleteTarea(
  id: string
) {
  return supabase
    .from("TAREAS")
    .delete()
    .eq("id", id);
}
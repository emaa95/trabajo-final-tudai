import { supabase } from "@/lib/supabase";

import type {
  CreateServicioDto,
  UpdateServicioDto,
} from "@/types";


export async function findAllServices() {
  return supabase
    .from("SERVICES")
    .select(`
      *,
      repuestos:SERVICE_REPUESTOS(*),

      trabajo:trabajo_id (
        *,
        vehiculo:vehiculo_id (
          *,
          cliente:cliente_id (*)
        )
      )
    `)
    .order("created_at", {
      ascending: false,
    });
}


export async function findServiceById(
  id: string
) {
  return supabase
    .from("SERVICES")
    .select(`
      *,

      repuestos:SERVICE_REPUESTOS(*),

      trabajo:trabajo_id (
        *,
        vehiculo:vehiculo_id (
          *,
          cliente:cliente_id (*)
        )
      )
    `)
    .eq("id", id)
    .single();
}


export async function findServiceByTrabajoId(
  trabajo_id: string
) {
  return supabase
    .from("SERVICES")
    .select(`
      *,

      repuestos:SERVICE_REPUESTOS(*)
    `)
    .eq("trabajo_id", trabajo_id)
    .single();
}

/*
export async function createService(
  payload: CreateServicioDto
) {
  return supabase
    .from("SERVICES")
    .insert(payload)
    .select(`
      *,
      repuestos:SERVICE_REPUESTOS(*)
    `)
    .single();
}


export async function updateService(
  id: string,
  payload: UpdateServicioDto
) {
  return supabase
    .from("SERVICES")
    .update(payload)
    .eq("id", id)
    .select(`
      *,
      repuestos:SERVICE_REPUESTOS(*)
    `)
    .single();
}
*/

export async function createService(
  payload: CreateServicioDto
) {
  return supabase
    .from("SERVICES")
    .insert(payload)
    .select()
    .single();
}

export async function updateService(
  id: string,
  payload: UpdateServicioDto
) {
  return supabase
    .from("SERVICES")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
}
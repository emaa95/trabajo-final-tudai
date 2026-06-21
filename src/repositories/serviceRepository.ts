import { supabase } from "@/lib/supabase";

import type {
  CreateServicioDto,
  UpdateServicioDto,
} from "@/types";

export async function findAllServices() {
  return supabase
    .from("SERVICES")
    .select("*")
    .order("nombre", {
      ascending: true,
    });
}

export async function findServiceById(
  id: string
) {
  return supabase
    .from("SERVICES")
    .select("*")
    .eq("id", id)
    .single();
}

export async function findServiceByTrabajoId(
  trabajo_id: string
) {
  return supabase
    .from('SERVICES')
    .select('*')
    .eq('trabajo_id', trabajo_id)
    .single();
}

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
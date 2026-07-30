import { supabase } from "@/lib/supabase";

import type {
  CreateServiceRepuestoDto,
  UpdateServiceRepuestoDto,
} from "@/types";


export async function findRepuestosByServiceId(
  service_id: string
) {
  return supabase
    .from("SERVICE_REPUESTOS")
    .select("*")
    .eq("service_id", service_id)
    .order("created_at", {
      ascending: true,
    });
}


export async function createServiceRepuesto(
  payload: CreateServiceRepuestoDto
) {
  return supabase
    .from("SERVICE_REPUESTOS")
    .insert(payload)
    .select()
    .single();
}


export async function updateServiceRepuesto(
  id: string,
  payload: UpdateServiceRepuestoDto
) {
  return supabase
    .from("SERVICE_REPUESTOS")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
}


export async function deleteServiceRepuesto(
  id: string
) {
  return supabase
    .from("SERVICE_REPUESTOS")
    .delete()
    .eq("id", id);
}
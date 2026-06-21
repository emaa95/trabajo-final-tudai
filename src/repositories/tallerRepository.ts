// src/repositories/tallerRepository.ts
import { supabase } from '@/lib/supabase';
import type { Taller } from '@/types';

export async function findTaller(id: string) {
  return supabase
    .from('TALLERES')
    .select('*')
    .eq('id', id)
    .single();
}

interface CreateTallerPayload {
  nombre: string;
  direccion: string;
  telefono: string;
}

export async function createTaller(
  payload: CreateTallerPayload
) {
  return supabase
    .from('TALLERES')
    .insert(payload)
    .select()
    .single();
}

export async function updateTaller(
  id: string,
  payload: Partial<Taller>
) {
  return supabase
    .from('TALLERES')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
}

export async function getTallerByNombre(
  nombre: string
) {
  return supabase
    .from("TALLERES")
    .select("id,nombre")
    .eq("nombre", nombre.trim());
}
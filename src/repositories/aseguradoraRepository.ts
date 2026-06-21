import { supabase } from '@/lib/supabase';
import type { Aseguradora } from '@/types';

export async function findAllAseguradoras() {
  return supabase
    .from('ASEGURADORAS')
    .select('*')
    .eq('activa', true)
    .order('nombre', {
      ascending: true,
    });
}

export async function findAseguradoraById(id: string) {
  return supabase
    .from('ASEGURADORAS')
    .select('*')
    .eq('id', id)
    .single();
}

interface CreateAseguradoraPayload {
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  cuit?: string;
  activa?: boolean;
}

export async function createAseguradora(
  payload: CreateAseguradoraPayload
) {
  console.log('[CREATE_ASEGURADORA]', payload);

  return supabase
    .from('ASEGURADORAS')
    .insert({
      ...payload,
      activa: payload.activa ?? true,
    })
    .select()
    .single();
}

export async function updateAseguradora(
  id: string,
  payload: Partial<Aseguradora>
) {
  return supabase
    .from('ASEGURADORAS')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteAseguradora(id: string) {
  // soft delete (coherente con tu modelo)
  return supabase
    .from('ASEGURADORAS')
    .update({ activa: false })
    .eq('id', id)
    .select()
    .single();
}
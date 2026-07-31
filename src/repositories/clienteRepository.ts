import { supabase } from '@/lib/supabase';

import type {
  CreateClienteDto,
  UpdateClienteDto,
} from '@/types';

export async function findAllClientes() {
  return supabase
    .from('CLIENTES')
    .select('*')
    .order('nombre', {
      ascending: true,
    });
}

export async function findClienteById(
  id: string
) {
  return supabase
    .from('CLIENTES')
    .select('*')
    .eq('id', id)
    .single();
}

export async function getClienteByDocumento(
  documento: string,
  taller_id: string
) {
  const { data, error } = await supabase
    .from("CLIENTES")
    .select("*")
    .eq("documento", documento)
    .eq("taller_id", taller_id)
    .maybeSingle();

  return { data, error };
}

export async function createCliente(
  payload: CreateClienteDto
) {
  return supabase
    .from('CLIENTES')
    .insert(payload)
    .select()
    .single();
}

export async function updateCliente(
  id: string,
  payload: UpdateClienteDto
) {
  return supabase
    .from('CLIENTES')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
}


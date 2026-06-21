import { supabase } from '@/lib/supabase';
import type { Vehiculo } from '@/types';

// ======================================================
// GET ALL
// ======================================================

export function findAllVehiculos() {
  return supabase
    .from('VEHICULOS')
    .select('*')
    .order('created_at', { ascending: false });
}

// ======================================================
// GET BY ID
// ======================================================

export function findVehiculoById(id: string) {
  return supabase
    .from('VEHICULOS')
    .select('*')
    .eq('id', id)
    .single();
}

// ======================================================
// CREATE
// ======================================================

export function createVehiculo(data: Partial<Vehiculo>) {
  return supabase
    .from('VEHICULOS')
    .insert(data)
    .select()
    .single();
}

// ======================================================
// UPDATE
// ======================================================

export function updateVehiculo(
  id: string,
  data: Partial<Vehiculo>
) {
  return supabase
    .from('VEHICULOS')
    .update(data)
    .eq('id', id)
    .select()
    .single();
}

// ======================================================
// DELETE
// ======================================================

export function deleteVehiculo(id: string) {
  return supabase
    .from('VEHICULOS')
    .delete()
    .eq('id', id);
}

export function findVehiculosByCliente(clienteId: string) {
  return supabase
    .from('VEHICULOS')
    .select('*, CLIENTES(*)')
    .eq('cliente_id', clienteId);
}
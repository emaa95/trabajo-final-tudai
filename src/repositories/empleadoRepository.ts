import { supabase } from '@/lib/supabase';
import type { Empleado } from '@/types';

export async function findAllEmpleados() {
  return supabase
    .from('EMPLEADOS')
    .select(`
      id,
      auth_user_id,
      nombre,
      apellido,
      dni,
      telefono,
      cargo,
      activo,
      taller_id,
      is_admin,
      fecha_ingreso
    `)
    .order('apellido', { ascending: true });
}

export async function updateEmpleado(
  id: string,
  payload: Partial<Empleado>
) {
  return supabase
    .from('EMPLEADOS')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
}

interface CreateEmpleadoPayload {
  auth_user_id?: string | null;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  cargo: string;
  taller_id?: string | null;
}

export async function createEmpleado(
  payload: CreateEmpleadoPayload
) {
  return supabase
    .from('EMPLEADOS')
    .insert({
      ...payload,
      is_admin: false, 
      activo: true,
    })
    .select()
    .single();
}

export async function getEmpleadoByDni(dni: string) {
  return supabase
    .from('EMPLEADOS')
    .select('*')
    .eq('dni', dni)
    .maybeSingle();
}
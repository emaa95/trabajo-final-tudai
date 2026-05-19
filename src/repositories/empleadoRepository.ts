import { supabase } from '@/lib/supabase';

import type { Empleado } from '@/types';

export async function findAllEmpleados() {
  return supabase
    .from('EMPLEADOS')
    .select('*')
    .order('apellido', {
      ascending: true,
    });
}

export async function createEmpleado(
  payload: Omit<Empleado, 'id'>
) {
  return supabase
    .from('EMPLEADOS')
    .insert(payload)
    .select()
    .single();
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
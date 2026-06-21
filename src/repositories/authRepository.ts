import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import type { Empleado } from "@/types";

// =========================
// TYPES
// =========================

export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

// =========================
// AUTH BASIC
// =========================

export async function getSession() {
  return supabase.auth.getSession();
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
) {
  return supabase.auth.signUp({
    email,
    password,

    options: {
      data: metadata,
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function onAuthStateChange(callback: AuthStateChangeCallback) {
  return supabase.auth.onAuthStateChange(callback);
}

// =========================
// CURRENT USER
// =========================

export async function getCurrentUser() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: authError };
  }

  const { data, error } = await supabase
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
      fecha_ingreso,
      is_admin,
      taller_id
    `)
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return {
    data: {
      id: user.id,
      email: user.email ?? '',
      empleado: {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        cargo: data.cargo,
        dni: data.dni,
        telefono: data.telefono,
        taller_id: data.taller_id,
        isAdmin: Boolean(data.is_admin),
      },
    },
    error: null,
  };
}

export async function getCurrentEmpleado() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError ?? new Error('No hay sesión activa'),
    };
  }

  const { data, error } = await supabase
    .from('EMPLEADOS')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  return {
    data: data as Empleado | null,
    error,
  };
}

import type { Session } from "@supabase/supabase-js";
import {
  getSession,
  signIn,
  signUp,
  signOut,
  onAuthStateChange,
  getCurrentUser,
  type AuthStateChangeCallback,
} from "@/repositories/authRepository";
import {
  createEmpleado,
  getEmpleadoByDni,
  getEmpleadoByAuthUserId,
} from "@/repositories/empleadoRepository";
import { createTaller } from "@/repositories/tallerRepository";
import type { RegisterPayload } from "@/types";
import { AppError } from "@/lib/errors/AppError";
import { ErrorCode } from "@/lib/errors/ErrorCode";
import { mapSupabaseAuthError } from "@/lib/errors/mappers/mapSupabaseAuthError";
import { mapSupabaseDbError } from "@/lib/errors/mappers/mapSupabaseDbError";

// =========================
// SESSION
// =========================

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await getSession();

  if (error) {
    console.warn("[getCurrentSession]", error);
    return null;
  }

  return data.session;
}

// =========================
// CURRENT USER
// =========================

export async function getCurrentUserData() {
  const { data: authUser, error } = await getCurrentUser();

  if (error) {
    console.warn("[getCurrentUserData auth]", error);
    return null;
  }

  if (!authUser) {
    return null;
  }


  const {
    data: empleado,
    error: empleadoError,
  } = await getEmpleadoByAuthUserId(
    authUser.id
  );


  if (empleadoError) {
    console.warn(
      "[getCurrentUserData empleado]",
      empleadoError
    );

    return null;
  }


  if (!empleado) {
    return null;
  }


  return {
    id: authUser.id,

    email:
      authUser.email ?? "",

    empleado: {
      id: empleado.id,

      nombre:
        empleado.nombre,

      apellido:
        empleado.apellido,

      cargo:
        empleado.cargo,

      dni:
        empleado.dni,

      telefono:
        empleado.telefono,

      taller_id:
        empleado.taller_id,

      is_admin:
        empleado.is_admin,
    },
  };
}

// =========================
// LOGIN
// =========================

export async function login(email: string, password: string) {
  const { data, error } = await signIn(email, password);

  if (error) {
    throw mapSupabaseAuthError(error);
  }

  return data;
}

// =========================
// REGISTER
// =========================

export async function register(payload: RegisterPayload) {
  // =========================
  // VALIDAR DNI
  // =========================

  const { data: empleadoExistente, error: empleadoExistenteError } =
    await getEmpleadoByDni(payload.dni);

  if (empleadoExistenteError) {
    throw mapSupabaseDbError(empleadoExistenteError);
  }

  if (empleadoExistente) {
    throw new AppError(
      ErrorCode.VALIDATION,
      "Ya existe un empleado con ese DNI"
    );
  }

  // =========================
  // CREAR USUARIO AUTH
  // =========================

  const { data, error } = await signUp(payload.email, payload.password, {
    nombre: payload.nombre,
    apellido: payload.apellido,
  });

  if (error) {
    throw mapSupabaseAuthError(error);
  }

  // =========================
  // LOGIN AUTOMÁTICO
  // =========================

  const { data: loginData, error: loginError } = await signIn(
    payload.email,
    payload.password
  );

  if (loginError) {
    throw mapSupabaseAuthError(loginError);
  }

  const authUser = loginData.user;

  if (!authUser) {
    throw new AppError(
      ErrorCode.UNKNOWN,
      "No se pudo autenticar el usuario"
    );
  }

  // =========================
  // CREAR TALLER
  // =========================

  const { data: taller, error: tallerError } = await createTaller({
    nombre: payload.taller_nombre.trim(),
    direccion: payload.taller_direccion,
    telefono: payload.taller_telefono,
  });

  if (tallerError) {
    throw mapSupabaseDbError(tallerError);
  }

  if (!taller) {
    throw new AppError(ErrorCode.UNKNOWN, "No se pudo crear el taller");
  }

  // =========================
  // CREAR EMPLEADO ADMIN
  // =========================

  const { error: empleadoError } = await createEmpleado({
    auth_user_id: authUser.id,
    nombre: payload.nombre,
    apellido: payload.apellido,
    dni: payload.dni,
    telefono: payload.telefono,
    cargo: "Administrativo",
    taller_id: taller.id,
    is_admin: true,
  });

  if (empleadoError) {
    throw mapSupabaseDbError(empleadoError);
  }

  return data;
}

// =========================
// LOGOUT
// =========================

export async function logout() {
  const { error } = await signOut();

  if (error) {
    throw mapSupabaseAuthError(error);
  }
}

// =========================
// AUTH LISTENER
// =========================

export function listenAuthChanges(callback: AuthStateChangeCallback) {
  return onAuthStateChange(callback);
}
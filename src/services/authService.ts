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
} from "@/repositories/empleadoRepository";

import {
  createTaller,
} from "@/repositories/tallerRepository";

import type { RegisterPayload } from "@/types";

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
  const { data, error } = await getCurrentUser();

  if (error) {
    console.warn("[getCurrentUserData]", error);
    return null;
  }

  return data ?? null;
}

// =========================
// LOGIN
// =========================

export async function login(email: string, password: string) {
  const { data, error } = await signIn(email, password);

  if (error) {
    throw new Error(error.message);
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

  const {
    data: empleadoExistente,
    error: empleadoExistenteError,
  } = await getEmpleadoByDni(payload.dni);

  if (empleadoExistenteError) {
    throw new Error(empleadoExistenteError.message);
  }

  if (empleadoExistente) {
    throw new Error("Ya existe un empleado con ese DNI");
  }

  // =========================
  // CREAR USUARIO AUTH
  // =========================

  const { data, error } = await signUp(
    payload.email,
    payload.password,
    {
      nombre: payload.nombre,
      apellido: payload.apellido,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  // =========================
  // LOGIN AUTOMÁTICO
  // =========================

  const {
    data: loginData,
    error: loginError,
  } = await signIn(
    payload.email,
    payload.password
  );

  if (loginError) {
    throw new Error(loginError.message);
  }

  const authUser = loginData.user;

  if (!authUser) {
    throw new Error(
      "No se pudo autenticar el usuario"
    );
  }

  // =========================
  // CREAR TALLER
  // =========================

  const {
    data: taller,
    error: tallerError,
  } = await createTaller({
    nombre: payload.taller_nombre.trim(),
    direccion: payload.taller_direccion,
    telefono: payload.taller_telefono,
  });

  if (tallerError) {
    if (
      tallerError.message.includes("unique") ||
      tallerError.message.includes("duplicate")
    ) {
      throw new Error(
        "Ya existe un taller con ese nombre"
      );
    }

    throw new Error(tallerError.message);
  }

  if (!taller) {
    throw new Error(
      "No se pudo crear el taller"
    );
  }

  // =========================
  // CREAR EMPLEADO ADMIN
  // =========================

  const { error: empleadoError } =
    await createEmpleado({
      auth_user_id: authUser.id,
      nombre: payload.nombre,
      apellido: payload.apellido,
      dni: payload.dni,
      telefono: payload.telefono,
      cargo: "Administrativo",
      taller_id: taller.id,
    });

  if (empleadoError) {
    throw new Error(
      empleadoError.message
    );
  }

  return data;
}

// =========================
// LOGOUT
// =========================

export async function logout() {
  const { error } = await signOut();

  if (error) {
    throw new Error(error.message);
  }
}

// =========================
// AUTH LISTENER
// =========================

export function listenAuthChanges(
  callback: AuthStateChangeCallback
) {
  return onAuthStateChange(callback);
}
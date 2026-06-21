import type {
  Empleado,
  CreateEmpleadoDto,
  UpdateEmpleadoDto,
} from '@/types';

import {
  findAllEmpleados,
  createEmpleado,
  updateEmpleado,
} from '@/repositories/empleadoRepository';

import { getCurrentEmpleado } from '@/repositories/authRepository';

// ======================================================
// GET ALL
// ======================================================

export async function getEmpleados(): Promise<Empleado[]> {
  const { data, error } = await findAllEmpleados();

  if (error) {
    console.error('[EMPLEADOS_SERVICE][GET_ALL]', error);

    throw new Error('No se pudieron obtener los empleados');
  }

  return data ?? [];
}

// ======================================================
// GET BY ID
// ======================================================

// ======================================================
// CREATE
// ======================================================

export async function crearEmpleado(
  payload: CreateEmpleadoDto
): Promise<Empleado> {
  
  if (!payload.nombre.trim()) throw new Error('El nombre es obligatorio');
  if (!payload.apellido.trim()) throw new Error('El apellido es obligatorio');
  if (!payload.dni.trim()) throw new Error('El DNI es obligatorio');
  if (!payload.telefono.trim()) throw new Error('El teléfono es obligatorio');
  if (!payload.cargo.trim()) throw new Error('El cargo es obligatorio');

  // Obtener el taller_id del admin logueado
  const { data: adminData, error: adminError } =
  await getCurrentEmpleado();

if (adminError || !adminData) {
  throw new Error('No se pudo obtener el empleado logueado');
}

  console.log('[CREATE] payload final:', {
  ...payload,
  taller_id: adminData.taller_id,
  auth_user_id: null,
});

  const { data, error } = await createEmpleado(
    normalizarEmpleado({
      ...payload,
      taller_id: adminData.taller_id,
      auth_user_id: null,
    })
  );

  if (error) {
    console.error('[EMPLEADOS_SERVICE][CREATE]', error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// UPDATE
// ======================================================

export async function actualizarEmpleado(
  id: string,
  payload: UpdateEmpleadoDto
): Promise<Empleado> {
  if (!id) {
    throw new Error('El ID del empleado es obligatorio');
  }

  const payloadNormalizado = normalizarUpdateEmpleado(payload);

  const { data, error } = await updateEmpleado(id, payloadNormalizado);

  if (error) {
    console.error('[EMPLEADOS_SERVICE][UPDATE]', error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// NORMALIZADORES
// ======================================================

function normalizarEmpleado(payload: CreateEmpleadoDto): CreateEmpleadoDto {
  return {
    ...payload,
    nombre: payload.nombre.trim(),
    apellido: payload.apellido.trim(),
    dni: payload.dni.trim(),
    telefono: payload.telefono.trim(),
    cargo: payload.cargo,
  };
}

function normalizarUpdateEmpleado(
  payload: UpdateEmpleadoDto
): UpdateEmpleadoDto {
  return {
    ...payload,
    nombre: payload.nombre?.trim(),
    apellido: payload.apellido?.trim(),
    dni: payload.dni?.trim(),
    telefono: payload.telefono?.trim(),
    cargo: payload.cargo,
  };
}

// ======================================================
// ERROR HANDLER
// ======================================================

function manejarErrorSupabase(error: {
  code?: string;
  message: string;
}): never {
  if (error.code === '23505') {
    throw new Error('Ya existe un empleado con esos datos');
  }

  if (error.code === '23503') {
    throw new Error('Relación inválida en los datos');
  }

  if (error.code === 'PGRST116') {
    throw new Error('Empleado no encontrado');
  }

  throw new Error(error.message);
}
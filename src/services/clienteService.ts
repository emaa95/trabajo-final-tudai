import type {
  Cliente,
  CreateClienteDto,
  UpdateClienteDto,
} from '@/types';

import {
  findAllClientes,
  findClienteById,
  createCliente,
  updateCliente,
  getClienteByDocumento,
} from '@/repositories/clienteRepository';

import { getCurrentEmpleado } from '@/repositories/authRepository';

// ======================================================
// GET ALL
// ======================================================

export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await findAllClientes();

  if (error) {
    console.error('[CLIENTES_SERVICE][GET_ALL]', error);
    throw new Error('No se pudieron obtener los clientes');
  }

  return data ?? [];
}

// ======================================================
// GET BY ID
// ======================================================

export async function getClienteById(id: string): Promise<Cliente> {
  if (!id) throw new Error('El ID del cliente es obligatorio');

  const { data, error } = await findClienteById(id);

  if (error) {
    console.error('[CLIENTES_SERVICE][GET_BY_ID]', error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// CREATE
// ======================================================

export async function crearCliente(
  payload: CreateClienteDto
): Promise<Cliente> {
  if (!payload.nombre?.trim()) {
    throw new Error('El nombre es obligatorio');
  }

  if (!payload.documento?.trim()) {
    throw new Error('El documento es obligatorio');
  }

  const { data: empleado, error: empleadoError } =
    await getCurrentEmpleado();

  if (empleadoError || !empleado) {
    throw new Error('No se pudo obtener el empleado logueado');
  }

 
  const { data: clienteExistente, error: searchError } =
    await getClienteByDocumento(
      payload.documento.trim(),
      empleado.taller_id
    );
    console.log("BUSQUEDA CLIENTE:", {
  documento: payload.documento.trim(),
  taller_id: empleado.taller_id,
  clienteExistente,
  searchError
});

  if (searchError) {
    console.error('[CLIENTES_SERVICE][SEARCH]', searchError);
    manejarErrorSupabase(searchError);
  }

  if (clienteExistente) {
    throw new Error('Ya existe un cliente con ese documento en este taller');
  }

  const clienteNormalizado = normalizarCliente(
    payload,
    empleado.taller_id
  );

  const { data, error } = await createCliente(clienteNormalizado);

  if (error) {
    console.error('[CLIENTES_SERVICE][CREATE]', error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// UPDATE
// ======================================================

export async function actualizarCliente(
  id: string,
  payload: UpdateClienteDto
): Promise<Cliente> {
  if (!id) throw new Error('El ID del cliente es obligatorio');

  const { data, error } = await updateCliente(
    id,
    normalizarUpdateCliente(payload)
  );

  if (error) {
    console.error('[CLIENTES_SERVICE][UPDATE]', error);
    manejarErrorSupabase(error);
  }

  return data;
}

// ======================================================
// NORMALIZACIÓN
// ======================================================

function normalizarCliente(
  payload: CreateClienteDto,
  taller_id: string
): CreateClienteDto {
  return {
    ...payload,
    taller_id,
    nombre: payload.nombre.trim(),
    documento: payload.documento?.trim(),
    tipo_documento: payload.tipo_documento,
    telefono: payload.telefono?.trim(),
    email: payload.email?.trim(),
    direccion: payload.direccion?.trim(),
  };
}

function normalizarUpdateCliente(
  payload: UpdateClienteDto
): UpdateClienteDto {
  return {
    ...payload,
    nombre: payload.nombre?.trim(),
    documento: payload.documento?.trim(),
    tipo_documento: payload.tipo_documento,
    telefono: payload.telefono?.trim(),
    email: payload.email?.trim(),
    direccion: payload.direccion?.trim(),
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
    throw new Error('Ya existe un cliente con esos datos');
  }

  if (error.code === '23503') {
    throw new Error('Relación inválida en los datos');
  }

  if (error.code === 'PGRST116') {
    throw new Error('Cliente no encontrado');
  }

  throw new Error(error.message);
}
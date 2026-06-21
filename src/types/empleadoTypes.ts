export type RolEmpleado =
  | 'Chapista'
  | 'Pintor'
  | 'Mecánico'
  | 'Administrativo';

  export const ROLES_EMPLEADO = [
  "Chapista",
  "Pintor",
  "Mecánico",
  "Administrativo",
] as const;

export type CargoEmpleado = (typeof ROLES_EMPLEADO)[number];

export interface Empleado {
  id: string;

  nombre: string;
  apellido: string;

  dni: string;
  telefono: string;

  email?: string;

  cargo: CargoEmpleado;

  activo: boolean;
  is_admin: boolean;

  fecha_ingreso: string;

  auth_user_id?: string | null;

  taller_id: string;
}

export interface CreateEmpleadoDto {
  nombre: string;
  apellido: string;

  dni: string;
  telefono: string;

  cargo: CargoEmpleado;

  taller_id?: string | null;

  auth_user_id?: string | null;
}

export interface UpdateEmpleadoDto {
  nombre?: string;
  apellido?: string;

  dni?: string;
  telefono?: string;

  cargo?: CargoEmpleado;

  activo?: boolean;

  is_admin?: boolean;
}
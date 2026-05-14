export type EstadoTrabajo =
  | 'Pendiente'
  | 'En reparación'
  | 'En pintura'
  | 'Listo para entregar'
  | 'Entregado'
  | 'Cancelada'
  | 'Pausada';

export type TipoTrabajo =
  | 'Particular'
  | 'Seguro';

export type EstadoSeguro =
  | 'Pendiente'
  | 'Aprobado'
  | 'Rechazado';

export type RolEmpleado =
  | 'Chapista'
  | 'Pintor'
  | 'Mecánico'
  | 'Administrativo';

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email?: string;
  rol: RolEmpleado;
  activo: boolean;
  fechaIngreso: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  dni: string;
}

export interface Vehiculo {
  id: string;
  patente: string;
  modelo: string;
  marca: string;
  año: number;
  color: string;
  clienteId: string;
}

export interface Seguro {
  id: string;
  compania: string;
  numeroSiniestro: string;
  estado: EstadoSeguro;
  montoAprobado: number;
}

export interface TareaTrabajo {
  id: string;

  titulo: string;

  realizada: boolean;

  costo: number;
}

export interface Trabajo {
  id: string;
  vehiculoId: string;
  clienteId: string;
  tipo: TipoTrabajo;
  estado: EstadoTrabajo;
  fechaIngreso: string;
  notas?: string;
  tareas: TareaTrabajo[];
  seguro?: Seguro;

  imagenes?: {
    antes: string[];
    despues: string[];
  };
}

export interface FormErrors {
  clienteId?: string;
  vehiculoId?: string;
  descripcionDano?: string;
  compania?: string;
  numeroSiniestro?: string;
  tareas?: string;
}

export interface ModalClienteProps {
  open: boolean;

  onClose: () => void;

  onCreated: (
    cliente: Cliente
  ) => void;
}

export interface ModalVehiculoProps {
  open: boolean;

  clienteId: string;

  onClose: () => void;

  onCreated: (
    vehiculo: Vehiculo
  ) => void;
}

export interface SeccionGeneralProps {
  tipo: TipoTrabajo;

  estado: EstadoTrabajo;

  fechaIngreso: string;

  onTipoChange: (
    value: TipoTrabajo | null
  ) => void;

  onEstadoChange: (
    value: EstadoTrabajo | null
  ) => void;

  onFechaIngresoChange: (
    value: string
  ) => void;
}

// =========================
// SECCION CLIENTE
// =========================

export interface SeccionClienteProps {
  clientes: Cliente[];

  vehiculos: Vehiculo[];

  clienteId?: string;

  vehiculoId?: string;

  clienteError?: string;

  vehiculoError?: string;

  onClienteChange: (
    clienteId: string | null
  ) => void;

  onVehiculoChange: (
    vehiculoId: string | null
  ) => void;

  onNuevoCliente: () => void;

  onNuevoVehiculo: () => void;
}

// =========================
// SECCION DESCRIPCION
// =========================

export interface SeccionDescripcionProps {
  descripcionDano: string;

  notas: string;

  error?: string;

  onDescripcionChange: (
    value: string
  ) => void;

  onNotasChange: (
    value: string
  ) => void;
}

export interface SeccionSeguroProps {
  compania?: string;

  numeroSiniestro: string;

  estadoSeguro: EstadoSeguro;

  montoAprobado: string;

  errors: FormErrors;

  onCompaniaChange: (
    value: string | null
  ) => void;

  onNumeroSiniestroChange: (
    value: string
  ) => void;

  onEstadoSeguroChange: (
    value: EstadoSeguro | null
  ) => void;

  onMontoAprobadoChange: (
    value: string
  ) => void;
}

// =========================
// CONSTANTES
// =========================

export const ESTADOS_TRABAJO: EstadoTrabajo[] = [
  'Pendiente',
  'En reparación',
  'En pintura',
  'Pausada',
  'Listo para entregar',
  'Entregado',
  'Cancelada',
];
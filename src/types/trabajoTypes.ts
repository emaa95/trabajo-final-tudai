import type { Aseguradora } from './aseguradoraTypes';
import type { Service, CreateServicePayload } from './serviceTypes';

export type EstadoTrabajo =
  | 'Pendiente'
  | 'En reparación'
  | 'En pintura'
  | 'Listo para entregar'
  | 'Entregado'
  | 'Cancelada'
  | 'Pausada';

export const ESTADOS_TRABAJO: EstadoTrabajo[] = [
  'Pendiente',
  'En reparación',
  'En pintura',
  'Listo para entregar',
  'Entregado',
  'Cancelada',
  'Pausada',
];

export type PrioridadTrabajo =
  | 'Baja'
  | 'Media'
  | 'Alta'
  | 'Urgente';

export const PRIORIDADES_TRABAJO: PrioridadTrabajo[] = [
  'Baja',
  'Media',
  'Alta',
  'Urgente',
];

export type TipoTrabajo =
  | 'Particular'
  | 'Seguro';

export const TRABAJOS_SOLICITADOS = [
  'Mecánica general',
  'Electricidad',
  'Motor',
  'Frenos',
  'Suspensión',
  'Dirección',
  'Chapa',
  'Pintura',
  'Service',
  'Diagnóstico',
  'Alineación y balanceo',
  'Neumáticos',
] as const;

export type TrabajoSolicitado =
  (typeof TRABAJOS_SOLICITADOS)[number];

export interface TareaTrabajo {
  id: string;
  titulo: string;
  costo: number;
  realizada: boolean;
}

export interface SeguroTrabajo {
  aseguradora_id: string;

  aseguradora?: Aseguradora;

  numero_poliza?: string;
  numero_denuncia?: string;
  numero_siniestro?: string;
  monto_aprobado?: number;
}

export interface Trabajo {
  id: string;

  cliente_id: string;

  vehiculo_id: string;

  tipo: TipoTrabajo;

  estado: EstadoTrabajo;

  prioridad?: PrioridadTrabajo;

  fecha_ingreso: string;

  fecha_cierre?: string;

  precio_total: number;

  trabajos_solicitados: TrabajoSolicitado[];

  notas?: string;

  asignado_a?: string;
}

export interface CreateTrabajoPayload {

  vehiculo_id: string;

  tipo: TipoTrabajo;

  estado?: EstadoTrabajo;

  prioridad?: PrioridadTrabajo;

  fecha_ingreso: string;

  trabajos_solicitados: TrabajoSolicitado[];

  precio_total: number;

  tareas: TareaTrabajo[];

  notas?: string;

  seguro?: SeguroTrabajo;

  service?: CreateServicePayload;

  asignado_a?: string;

  taller_id?: string;
}

export interface FormErrors {
  clienteId?: string;

  vehiculoId?: string;

  trabajosSolicitados?: string;

  tareas?: string;

  compania?: string;

  numero_poliza?: string;

  numero_denuncia?: string;

  numero_siniestro?: string;
}

export interface TrabajoFormData {
  cliente_id?: string;

  vehiculo_id?: string;

  tipo: TipoTrabajo;

  estado: EstadoTrabajo;

  prioridad?: PrioridadTrabajo;

  fecha_ingreso: string;

  trabajos_solicitados: TrabajoSolicitado[];

  tareas: TareaTrabajo[];

  notas?: string;

  asignado_a?: string;

  seguro?: {
    aseguradora_id?: string;
    numero_poliza?: string;
    numero_denuncia?: string;
    numero_siniestro?: string;
    monto_aprobado?: number;
  };

  service?: CreateServicePayload;
}

export interface SeccionGeneralProps {
  tipo: TipoTrabajo;

  estado: EstadoTrabajo;

  prioridad?: PrioridadTrabajo;

  fechaIngreso: string;

  asignadoA?: string | null;

  empleados: {
    id: string;
    nombre: string;
    apellido: string;
  }[];

  onTipoChange: (
    tipo: TipoTrabajo
  ) => void;

  onEstadoChange: (
    estado: EstadoTrabajo
  ) => void;

  onPrioridadChange: (
    prioridad: PrioridadTrabajo
  ) => void;

  onFechaIngresoChange: (
    fecha: string
  ) => void;

  onAsignadoAChange: (
    empleadoId: string | null
  ) => void;
}
export interface TrabajoDetalle {
  id: string;
  estado: EstadoTrabajo;
  tipo: TipoTrabajo;
  prioridad?: PrioridadTrabajo;
  precio_total: number;
  fecha_ingreso: string;
  fecha_creacion: string;
  fecha_cierre?: string;
  notas?: string;
  asignado_a?: string;
  trabajos_solicitados: TrabajoSolicitado[];
  service?: Service | null;
  vehiculo: {
    id: string;
    patente: string;
    marca: string;
    modelo: string;
    anio: number;
    color?: string;
    cliente: {
      id: string;
      nombre: string;
      telefono?: string;
      email?: string;
      documento?: string;
      tipo_documento?: 'DNI' | 'CUIL' | 'CUIT';
    };
  };

  seguro?: {
  id: string;
  numero_poliza?: string;
  numero_denuncia?: string;
  numero_siniestro: string;
  monto_aprobado?: number;
  aseguradora?: {
    id: string;
    nombre: string;
  };
}[];

  tareas?: TareaTrabajo[];
}
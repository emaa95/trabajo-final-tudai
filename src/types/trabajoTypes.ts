import type { Aseguradora } from './aseguradoraTypes';
import type { Service } from './serviceTypes';

export const ESTADOS_TRABAJO = [
  "Pendiente",
  "En reparación",
  "En pintura",
  "Listo para entregar",
  "Entregado",
  "Cancelada",
  "Pausada",
] as const;

export type EstadoTrabajo =
  (typeof ESTADOS_TRABAJO)[number];

export const ESTADOS_TRABAJO_BLOQUEADOS: EstadoTrabajo[] = [
  "Entregado",
  "Cancelada",
];


export interface PermisosEstadoTrabajo {
  editarOrden: boolean;
  editarEstado: boolean;
  editarPrioridad: boolean;

  agregarTareas: boolean;
  editarTareas: boolean;
  eliminarTareas: boolean;
  marcarTareas: boolean;

  generarPresupuesto: boolean;
  gestionarService: boolean;

  imprimir: boolean;
}


export const PERMISOS_ESTADO_TRABAJO: Record<
  EstadoTrabajo,
  PermisosEstadoTrabajo
> = {

  Pendiente: {
    editarOrden: true,
    editarEstado: true,
    editarPrioridad: true,

    agregarTareas: true,
    editarTareas: true,
    eliminarTareas: true,
    marcarTareas: true,

    generarPresupuesto: true,
    gestionarService: true,

    imprimir: true,
  },


  "En reparación": {
    editarOrden: true,
    editarEstado: true,
    editarPrioridad: true,

    agregarTareas: true,
    editarTareas: true,
    eliminarTareas: true,
    marcarTareas: true,

    generarPresupuesto: true,
    gestionarService: true,

    imprimir: true,
  },


  "En pintura": {
    editarOrden: true,
    editarEstado: true,
    editarPrioridad: false,

    agregarTareas: true,
    editarTareas: true,
    eliminarTareas: true,
    marcarTareas: true,

    generarPresupuesto: true,
    gestionarService: true,

    imprimir: true,
  },


  Pausada: {
    editarOrden: true,
    editarEstado: true,
    editarPrioridad: false,

    agregarTareas: true,
    editarTareas: true,
    eliminarTareas: true,
    marcarTareas: true,

    generarPresupuesto: true,
    gestionarService: true,

    imprimir: true,
  },


  "Listo para entregar": {
    editarOrden: false,
    editarEstado: true,
    editarPrioridad: false,

    agregarTareas: false,
    editarTareas: false,
    eliminarTareas: false,
    marcarTareas: false,

    generarPresupuesto: true,
    gestionarService: true,

    imprimir: true,
  },


  Entregado: {
    editarOrden: false,
    editarEstado: false,
    editarPrioridad: false,

    agregarTareas: false,
    editarTareas: false,
    eliminarTareas: false,
    marcarTareas: false,

    generarPresupuesto: true,
    gestionarService: false,

    imprimir: true,
  },


  Cancelada: {
    editarOrden: false,
    editarEstado: false,
    editarPrioridad: false,

    agregarTareas: false,
    editarTareas: false,
    eliminarTareas: false,
    marcarTareas: false,

    generarPresupuesto: false,
    gestionarService: false,

    imprimir: true,
  },
};


export const TRANSICIONES_ESTADO_TRABAJO: Record<
  EstadoTrabajo,
  EstadoTrabajo[]
> = {

  Pendiente: [
    "En reparación",
    "Cancelada",
  ],


  "En reparación": [
    "En pintura",
    "Pausada",
    "Cancelada",
  ],


  "En pintura": [
    "Listo para entregar",
    "Pausada",
    "Cancelada",
  ],


  Pausada: [
    "En reparación",
    "En pintura",
    "Cancelada",
  ],


  "Listo para entregar": [
    "Entregado",
    "En reparación",
    "En pintura",
  ],


  Entregado: [],


  Cancelada: [],
};


export const getPermisosEstadoTrabajo = (
  estado: EstadoTrabajo,
): PermisosEstadoTrabajo =>
  PERMISOS_ESTADO_TRABAJO[estado];


export const getEstadosDisponibles = (
  estado: EstadoTrabajo,
): EstadoTrabajo[] => [
  estado,
  ...TRANSICIONES_ESTADO_TRABAJO[estado],
];

export const PRIORIDADES_TRABAJO = [
  "Baja",
  "Media",
  "Alta",
  "Urgente",
] as const;

export type PrioridadTrabajo =
  (typeof PRIORIDADES_TRABAJO)[number];

export const TIPOS_TRABAJO = [
  "Particular",
  "Seguro",
] as const;

export type TipoTrabajo =
  (typeof TIPOS_TRABAJO)[number];

export const TRABAJOS_SOLICITADOS = [
  "Mecánica general",
  "Electricidad",
  "Motor",
  "Frenos",
  "Suspensión",
  "Dirección",
  "Chapa",
  "Pintura",
  "Service",
  "Diagnóstico",
  "Alineación y balanceo",
  "Neumáticos",
] as const;

export type TrabajoSolicitado =
  (typeof TRABAJOS_SOLICITADOS)[number];

export interface TareaTrabajo {
  id: string;
  titulo: string;
  costo: number;
  realizada: boolean;
}

export type TareaTrabajoDraft = {
  id?: string;
  titulo: string;
  costo: number;
  realizada: boolean;
  isNew?: boolean;
};

export type TrabajoDetalleDraft =
  Omit<TrabajoDetalle, "tareas"> & {
    tareas?: TareaTrabajoDraft[];
  };

export type CreateTareaTrabajo = {
  titulo: string;
  costo: number;
  realizada: boolean;
};

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

}

export interface CreateTrabajoPayload {

  vehiculo_id: string;

  tipo: TipoTrabajo;

  estado?: EstadoTrabajo;

  prioridad?: PrioridadTrabajo;

  fecha_ingreso: string;

  trabajos_solicitados: TrabajoSolicitado[];

  precio_total: number;

  tareas: CreateTareaTrabajo[];

  notas?: string;

  seguro?: SeguroTrabajo;

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

export interface SeccionDescripcionProps {
  descripcionDano: string;
  notas: string;
  error?: string;
  onDescripcionChange: (value: string) => void;
  onNotasChange: (value: string) => void;
}

export interface SeccionServiciosSolicitadosProps {
  trabajosSolicitados: TrabajoSolicitado[];
  otroTrabajo: string;
  error?: string;
  onTrabajosChange: (value: TrabajoSolicitado[]) => void;
  onOtroTrabajoChange: (value: string) => void;
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
      direccion?: string;
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
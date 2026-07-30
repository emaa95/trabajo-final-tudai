export const TIPOS_ACEITE = [
  "0W20",
  "5W20",
  "5W30",
  "5W40",
  "10W30",
  "10W40",
  "15W40",
  "20W50",
] as const;

export type TipoAceite = (typeof TIPOS_ACEITE)[number];

export const REPUESTOS_SERVICE = [
  {
    id: "ACEITE_MOTOR",
    nombre: "Aceite de motor",
    unidad: "L",
    opciones: TIPOS_ACEITE,
  },
  {
    id: "FILTRO_ACEITE",
    nombre: "Filtro de aceite",
    unidad: "U",
  },
  {
    id: "FILTRO_AIRE",
    nombre: "Filtro de aire",
    unidad: "U",
  },
  {
    id: "FILTRO_COMBUSTIBLE",
    nombre: "Filtro de combustible",
    unidad: "U",
  },
  {
    id: "FILTRO_HABITACULO",
    nombre: "Filtro habitáculo",
    unidad: "U",
  },
  {
    id: "BUJIAS",
    nombre: "Bujías",
    unidad: "U",
  },
  {
    id: "CORREA_DISTRIBUCION",
    nombre: "Correa de distribución",
    unidad: "U",
  },
  {
    id: "CORREA_ACCESORIOS",
    nombre: "Correa de accesorios",
    unidad: "U",
  },
  {
    id: "LIQUIDO_FRENOS",
    nombre: "Líquido de frenos",
    unidad: "L",
  },
  {
    id: "LIQUIDO_REFRIGERANTE",
    nombre: "Líquido refrigerante",
    unidad: "L",
  },
  {
    id: "PASTILLAS_FRENO",
    nombre: "Pastillas de freno",
    unidad: "U",
  },
  {
    id: "ESCOBILLAS",
    nombre: "Escobillas",
    unidad: "U",
  },
] as const;

export type RepuestoCatalogo =
  (typeof REPUESTOS_SERVICE)[number];

export interface ServiceRepuesto {
  id: string;
  created_at: string;

  service_id: string;

  descripcion: string;
  cantidad: number;
  unidad: string;
}

export interface CreateServiceRepuestoDto {
  service_id: string;

  descripcion: string;
  cantidad: number;
  unidad: string;
}

export type UpdateServiceRepuestoDto =
  Partial<CreateServiceRepuestoDto>;

export interface Service {
  id: string;
  created_at: string;

  trabajo_id: string;

  kilometraje_actual: number;

  proximo_service_km: number | null;
  proxima_fecha_service: string | null;

  observaciones: string | null;

  repuestos: ServiceRepuesto[];
}

export interface ServiceDetalle extends Service {
  trabajo: {
    id: string;

    estado: string;

    fecha_ingreso: string;

    vehiculo: {
      id: string;

      patente: string;

      marca: string;

      modelo: string;

      anio: number;

      cliente: {
        id: string;

        nombre: string;
      } | null;
    };
  };
}

export interface CreateServicioDto {
  trabajo_id: string;

  kilometraje_actual: number;

  proximo_service_km?: number | null;
  proxima_fecha_service?: string | null;

  observaciones?: string | null;
}

export type UpdateServicioDto =
  Partial<CreateServicioDto>;


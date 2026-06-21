export const TIPOS_ACEITE = [
  '0W20', '5W20', '5W30', '5W40',
  '10W30', '10W40', '15W40', '20W50',
] as const;

export type TipoAceite = (typeof TIPOS_ACEITE)[number];

export const REPUESTOS_SERVICE = [
  'Filtro de aceite', 'Filtro de aire', 'Filtro de combustible',
  'Filtro habitáculo', 'Bujías', 'Correa de distribución',
  'Correa de accesorios', 'Líquido de frenos', 'Líquido refrigerante',
  'Pastillas de freno', 'Escobillas',
] as const;

export type RepuestoService = (typeof REPUESTOS_SERVICE)[number];

export interface Service {
  id: string;
  created_at: string;
  trabajo_id: string;
  kilometraje_actual: number | null;
  aceite_utilizado: string | null;
  proximo_service_km: number | null;
  proxima_fecha_service: string | null;
  observaciones: string | null;
  repuestos: RepuestoService[];
}

export interface SeccionServiceProps {
  tipoAceite: TipoAceite | undefined;
  repuestos: RepuestoService[];
  kilometrajeActual: string;                           
  otrosRepuestos: string;
  proximoServiceKm: string;
  proximoServiceFecha: string;
  onTipoAceiteChange: (value: TipoAceite | undefined) => void;
  onRepuestosChange: (value: RepuestoService[]) => void;
  onKilometrajeActualChange: (value: string) => void;  
  onOtrosRepuestosChange: (value: string) => void;
  onProximoServiceKmChange: (value: string) => void;
  onProximoServiceFechaChange: (value: string) => void;
}

export interface CreateServicePayload {
  aceite_utilizado: TipoAceite;
  kilometraje_actual?: number | null;

  proximo_service_km?: number | null;
  proxima_fecha_service?: string | null;

  observaciones?: string | null;

  repuestos: RepuestoService[];
}

export interface CreateServicioDto {
  trabajo_id: string;

  kilometraje_actual?: number | null;
  aceite_utilizado?: string | null;
  proximo_service_km?: number | null;
  proxima_fecha_service?: string | null;
  observaciones?: string | null;
}

export type UpdateServicioDto =
  Partial<CreateServicioDto>;
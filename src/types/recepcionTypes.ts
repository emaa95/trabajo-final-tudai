export const ESTADOS_VEHICULO_INGRESO = [
  'Bueno',
  'Regular',
  'Malo',
] as const;

export type EstadoVehiculoIngreso =
  (typeof ESTADOS_VEHICULO_INGRESO)[number];

export const NIVELES_COMBUSTIBLE = [
  'Vacío',
  '1/4',
  '1/2',
  '3/4',
  'Lleno',
] as const;

export type NivelCombustible =
  (typeof NIVELES_COMBUSTIBLE)[number];

export const PERTENENCIAS_VEHICULO = [
  'Llave',
  'Cédula',
  'Seguro',
  'Auxilio',
  'Criquet',
  'Manual',
] as const;

export type PertenenciaVehiculo =
  (typeof PERTENENCIAS_VEHICULO)[number];

export interface SeccionRecepcionVehiculoProps {
  estadoGeneral: EstadoVehiculoIngreso | undefined;

  combustible: NivelCombustible | undefined;

  observaciones: string;

  pertenencias: PertenenciaVehiculo[];

  otrasPertenencias: string;

  onEstadoGeneralChange: (
    estado: EstadoVehiculoIngreso
  ) => void;

  onCombustibleChange: (
    combustible: NivelCombustible
  ) => void;

  onObservacionesChange: (
    observaciones: string
  ) => void;

  onPertenenciasChange: (
    pertenencias: PertenenciaVehiculo[]
  ) => void;

  onOtrasPertenenciasChange: (
    valor: string
  ) => void;
}


export interface RecepcionVehiculo {
  estadoGeneral: EstadoVehiculoIngreso;
  combustible: NivelCombustible;
  observaciones?: string;
  pertenencias: PertenenciaVehiculo[];
  otrasPertenencias?: string;
}
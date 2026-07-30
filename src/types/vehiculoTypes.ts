import type { Cliente } from "./clienteTypes";

export interface Vehiculo {
  id: string;

  patente: string;

  marca: string | null;
  modelo: string | null;

  anio: number | null;
  color: string | null;

  codigo_color?: string | null;

  cliente_id: string;

  created_at: string;
}

export interface CreateVehiculoDto {
  patente: string;

  marca?: string;
  modelo?: string;

  anio?: number;
  color?: string;
  codigo_color?: string | null;

  cliente_id?: string;
  taller_id:string;
}

export interface UpdateVehiculoDto {
  patente?: string;

  marca?: string;
  modelo?: string;

  anio?: number;
  color?: string;
  codigo_color?: string | null;
  cliente_id?: string;
}

export interface SeccionVehiculoProps {
  vehiculos: Vehiculo[];

  cliente_id: string | undefined;
  vehiculoId: string | undefined;
loading?: boolean;
  error?: string;

  onVehiculoChange: (id?: string) => void;

  onNuevoVehiculo: () => void;
}

export interface ModalVehiculoProps {
  open: boolean;
  clientes: Cliente[];
 
  // Si se pasa, el modal entra en modo edición y precarga el formulario.
  vehiculo?: Vehiculo | null;
 
  onClose: () => void;
 
  // Modo creación: el modal arma el DTO, el padre hace el alta.
  onCreated: (dto: CreateVehiculoDto) => void | Promise<void>;
 
  // Modo edición: el modal arma el DTO, el padre hace el update.
  onUpdated?: (
    id: string,
    dto: UpdateVehiculoDto,
  ) => void | Promise<void>;
}

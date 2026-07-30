export interface ServiceRepuesto {
  id: string;
  created_at: string;

  service_id: string;

  descripcion: string | null;
  cantidad: number | null;
  unidad: string | null;
}

export interface CreateServiceRepuestoDto {
  service_id: string;

  descripcion: string;
  cantidad: number;
  unidad: string;
}

export type UpdateServiceRepuestoDto =
  Partial<CreateServiceRepuestoDto>;

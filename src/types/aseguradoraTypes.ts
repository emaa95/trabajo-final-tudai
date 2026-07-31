// =========================
// ASEGURADORA
// =========================
export interface Aseguradora {
  id: string;

  nombre: string;

  telefono?: string;
  email?: string;

  direccion?: string;
  cuit?: string;

  activa: boolean;
  created_at: string;
}

export interface CreateAseguradoraDto {
  nombre: string;

  telefono?: string;
  email?: string;

  direccion?: string;
  cuit?: string;

  activa?: boolean;
}

export interface UpdateAseguradoraDto {
  nombre?: string;

  telefono?: string;
  email?: string;

  direccion?: string;
  cuit?: string;

  activa?: boolean;
}

export interface SeccionSeguroErrors {
  compania?: string | undefined;
  numero_siniestro?: string;
  numero_poliza?: string;
  numero_denuncia?: string;
}

export interface SeccionSeguroProps {
  aseguradoras: Aseguradora[];
   
  compania: string | undefined;

  numero_poliza: string;

  numero_siniestro: string;

  numero_denuncia: string;

  monto_aprobado: string;

  errors: {
    compania?: string;
    numero_poliza?: string;
    numero_siniestro?: string;
    numero_denuncia?: string;
  };

  onCompaniaChange: (
    compania: string | null
  ) => void;

  onNumeroPolizaChange: (
    numeroPoliza: string
  ) => void;

  onNumeroSiniestroChange: (
    numeroSiniestro: string
  ) => void;

  onNumeroDenunciaChange: (
    numeroDenuncia: string
  ) => void;

  onMontoAprobadoChange: (
    monto: string
  ) => void;
}

export interface ModalAseguradoraProps {
  open: boolean;

  aseguradora?: Aseguradora | null;

  onClose: () => void;

  onCreated: (
    aseguradora: CreateAseguradoraDto
  ) => Promise<void>;

  onUpdated?: (
    id: string,
    data: UpdateAseguradoraDto
  ) => Promise<void>;
}
export interface Cliente {
  id: string;

  nombre: string;

  apellido: string;

  telefono?: string;

  email?: string;
  direccion?: string;

  documento?: string;
  tipo_documento?: 'DNI' | 'CUIL' | 'CUIT';

  created_at: string;
}

export interface CreateClienteDto {
  nombre: string;
  apellido?: string;

  telefono?: string;

  documento?: string;
  tipo_documento?: 'DNI' | 'CUIL' | 'CUIT';

  email?: string;
  direccion?: string;
  taller_id?:string;
}

export interface UpdateClienteDto {
  nombre?: string;
  apellido?: string;

  telefono?: string;

  documento?: string;
  tipo_documento?: 'DNI' | 'CUIL' | 'CUIT';

  email?: string;
  direccion?: string;
}

export interface SeccionClienteProps {
  clientes: Cliente[];

  clienteId: string | undefined;

  error?: string;

  onClienteChange: (
    clienteId: string
  ) => void;

  onNuevoCliente: () => void;
}

export interface ModalClienteProps {
  open: boolean;
  onClose: () => void;
  onCreated: (cliente: Cliente) => void;
}
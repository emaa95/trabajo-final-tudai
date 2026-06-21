export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni: string;
  telefono: string;
  taller_nombre: string;
  taller_direccion: string;
  taller_telefono: string;
}

export interface RegisterForm
  extends RegisterPayload {
  confirmPassword: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  
  empleado: {
    id: string;
    nombre: string;
    apellido: string;
    cargo: string;
    dni?: string;
    telefono?: string;
    isAdmin: boolean;
  };
}
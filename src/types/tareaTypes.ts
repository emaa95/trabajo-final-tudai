export interface Tarea {
  id: string;
  created_at: string;
  titulo: string;
  costo: number;
  realizada: boolean;
  trabajo_id: string;
}


export type CreateTareaPayload = Omit<
  Tarea,
  "id" | "created_at"
>;
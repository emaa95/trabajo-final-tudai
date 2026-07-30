import { supabase } from "@/lib/supabase";

interface CrearAccesoEmpleadoPayload {
  empleado_id: string;
  email: string;
  is_admin: boolean;
}

export async function crearAccesoEmpleado(
  payload: CrearAccesoEmpleadoPayload
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("SESSION", session);

  const { data, error } =
    await supabase.functions.invoke(
      "crear-acceso-empleado",
      {
        body: payload,
      }
    );

  if (error) {
    throw error;
  }

  return data;
}
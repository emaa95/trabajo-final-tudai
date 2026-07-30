import { supabase } from '@/lib/supabase';
import type { Trabajo, CreateTrabajoPayload } from '@/types';

export async function findAllTrabajos() {
  return supabase
    .from('ORDENES_TRABAJO')
    .select(`
      *,
      vehiculo:vehiculo_id (
        *,
        cliente:cliente_id (*)
      ),
      seguro:ORDENES_TRABAJO_SEGURO (
        *,
        aseguradora:aseguradora_id (*)
      )
    `);
}

export async function findTrabajoById(id: string) {
  return supabase
    .from('ORDENES_TRABAJO')
    .select(`
      *,
      vehiculo:vehiculo_id (
        *,
        cliente:cliente_id (*)
      ),
      seguro:ORDENES_TRABAJO_SEGURO (
        *,
        aseguradora:aseguradora_id (*)
      ),
      tareas:TAREAS (*),
      service:SERVICES (
        *,
        repuestos:SERVICE_REPUESTOS (*)
      )
    `)
    .eq('id', id)
    .limit(1)
    .maybeSingle();
}

export async function createTrabajo(payload: CreateTrabajoPayload) {
  const { seguro, tareas, ...ordenTrabajo } = payload;

  const { data, error } = await supabase
    .from('ORDENES_TRABAJO')
    .insert(ordenTrabajo)
    .select()
    .single();

  if (error) throw error;

  const trabajoId = data.id;

  // TAREAS
  if (tareas.length > 0) {
    const { error: tareasError } = await supabase
      .from('TAREAS')
      .insert(
        tareas.map((tarea) => ({
          titulo: tarea.titulo,
          costo: tarea.costo,
          realizada: tarea.realizada,
          trabajo_id: trabajoId,
        }))
      );

    if (tareasError) throw tareasError;
  }

  // SEGURO
  if (seguro) {
    const { error: seguroError } = await supabase
      .from('ORDENES_TRABAJO_SEGURO')
      .insert({
        trabajo_id: trabajoId,
        aseguradora_id: seguro.aseguradora_id,
        numero_poliza: seguro.numero_poliza,
        numero_denuncia: seguro.numero_denuncia,
        numero_siniestro: seguro.numero_siniestro,
        monto_aprobado: seguro.monto_aprobado,
      });

    if (seguroError) throw seguroError;
  }

  return data;
}

export async function updateTrabajo(id: string, payload: Partial<Trabajo>) {
  return supabase
    .from('ORDENES_TRABAJO')
    .update(payload)
    .eq('id', id)
    .select(`
  *,
  vehiculo:vehiculo_id (
    *,
    cliente:cliente_id (*)
  ),
  seguro:ORDENES_TRABAJO_SEGURO (
    *,
    aseguradora:aseguradora_id (*)
  )
`)
    .single();
}

export async function findTrabajosByVehiculo(vehiculoId: string) {
  return supabase
    .from('ORDENES_TRABAJO')
    .select(`
      *,
      service:SERVICES (
        *,
        repuestos:SERVICE_REPUESTOS (*)
      )
    `)
    .eq('vehiculo_id', vehiculoId)
    .order('fecha_creacion', {
      ascending: false,
    });
}
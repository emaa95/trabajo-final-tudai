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
        *
      )
    `)
    .eq('id', id)
    .limit(1)
    .maybeSingle();
}

export async function createTrabajo(payload: CreateTrabajoPayload) {
  const { seguro, tareas, service, ...ordenTrabajo } = payload;

  // cliente_id ya no va en ordenTrabajo, se obtiene desde el vehículo
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
      .from('ORDENES_TRABAJO_SEGURO')  // nombre corregido
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

  // SERVICE
  if (service) {
    const { data: serviceData, error: serviceError } = await supabase
      .from('SERVICES') 
      .insert({
        trabajo_id: trabajoId,
        kilometraje_actual: service.kilometraje_actual, 
        aceite_utilizado: service.aceite_utilizado,
        proximo_service_km: service.proximo_service_km,
        proxima_fecha_service: service.proxima_fecha_service,
        observaciones: service.observaciones,
      })
      .select()
      .single();

    if (serviceError) throw serviceError;

    // SERVICE_REPUESTOS
    if (service.repuestos.length > 0) {
      const { error: repuestosError } = await supabase
        .from('SERVICE_REPUESTOS')
        .insert(
          service.repuestos.map((repuesto) => ({
            service_id: serviceData.id,
            descripcion: repuesto,
            cantidad: 1,
          }))
        );
      if (repuestosError) throw repuestosError;
    }
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
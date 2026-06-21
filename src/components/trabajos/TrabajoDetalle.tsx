import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge, TipoBadge } from "../common/Badges";
import { PresupuestoModal } from "@/components/modals/PresupuestoModal";
import { ModalService } from "@/components/modals/ModalService";
import { useTrabajos } from "@/hooks/useTrabajos";
import { ESTADOS_TRABAJO, type EstadoTrabajo } from "@/types";

import {
  ArrowLeft,
  Car,
  User,
  Calendar,
  FileText,
  Shield,
  Printer,
  CheckCircle,
  Wrench,
  Clock,
  Mail,
  Phone,
  Gauge,
  Droplets,
} from "lucide-react";

import { toast } from "sonner";
import { obtenerColorVehiculo } from "@/utils/vehiculoColors";

export function TrabajoDetalle() {
  const { id } = useParams();

  const { trabajoSeleccionado, updateTrabajo, fetchTrabajoById, loading } =useTrabajos();

  const [estadoActual, setEstadoActual] = useState<EstadoTrabajo>("Pendiente");
  const [showPresupuesto, setShowPresupuesto] = useState(false);
  const [showService, setShowService] = useState(false);

  
 useEffect(() => {
  if (!id) return;

  fetchTrabajoById(id);
}, [id]);

  const trabajo = trabajoSeleccionado;
  const vehiculo = trabajo?.vehiculo;
  const cliente = trabajo?.vehiculo.cliente;

 const serviceSeleccionado = trabajo?.service;
  useEffect(() => {
    if (trabajo) setEstadoActual(trabajo.estado);
  }, [trabajo]);

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleActualizarEstado = async () => {
    if (!trabajo) return;

    try {
      await updateTrabajo(trabajo.id, { estado: estadoActual });
      toast.success(`Estado actualizado a "${estadoActual}"`);
    } catch {
      toast.error("No se pudo actualizar el estado");
    }
  };

  if (loading && !trabajo) return <div className="p-6">Cargando...</div>;

  if (!trabajo || !vehiculo || !cliente) {
    return (
      <div className="p-6 text-center">
        Trabajo no encontrado
        <Link to="/trabajos">
          <Button className="mt-4">Volver</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
  
  {/* HEADER SUPERIOR */}
  <div className="flex items-center justify-between mb-6">
    
    {/* izquierda: volver */}
    <Link to="/trabajos">
      <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
        <ArrowLeft className="size-4 mr-2" />
        Volver
      </Button>
    </Link>

    {/* derecha: badges */}
    <div className="flex gap-2">
      <EstadoBadge estado={estadoActual} />
      <TipoBadge tipo={trabajo.tipo} />
    </div>
  </div>

  {/* CONTENIDO PRINCIPAL DEL HEADER */}
  <div className="space-y-1">
    <p className="text-slate-300 text-sm flex items-center gap-2">
      <Wrench className="size-4" />
      Orden de trabajo
    </p>

    <p className="text-xl font-semibold">
      OT-{trabajo.id.slice(-4).toUpperCase()}-
      {new Date(trabajo.fecha_ingreso).getFullYear()}
    </p>

    <p className="text-slate-300 flex items-center gap-2">
      <Car className="size-4" />
      {vehiculo.marca} {vehiculo.modelo} • {vehiculo.patente}
    </p>

    <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
      <Calendar className="size-4" />
      Ingreso: {formatFecha(trabajo.fecha_ingreso)}
    </p>
    <p className="text-slate-300 flex items-center gap-2">
      <Gauge className="size-4" />
      <span className="font-medium">
        {trabajo.precio_total?.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })}
      </span>
      {trabajo.prioridad && (
        <span className="ml-3 text-sm text-slate-300">• {trabajo.prioridad}</span>
      )}
    </p>
  </div>
</div>

      {/* GRID PRINCIPAL */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">
          {/* VEHICULO + CLIENTE */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="text-blue-500" />
                  Vehículo
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-lg font-bold">{vehiculo.patente}</p>
                <p className="text-slate-600">
                  {vehiculo.marca} {vehiculo.modelo}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {vehiculo.anio && <span>{vehiculo.anio}</span>}

                  {vehiculo.color && (
                    <>
                      <span>•</span>

                      <div className="flex items-center gap-2">
                        <div
                          className="size-2.5 rounded-full border"
                          style={{
                            backgroundColor: obtenerColorVehiculo(
                              vehiculo.color,
                            ),
                          }}
                        />

                        <span>{vehiculo.color}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-emerald-500" />
                  Cliente
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="font-bold">{cliente.nombre}</p>
                <p className="text-slate-600 flex items-center gap-2">
                  <Phone className="size-4" />
                  {cliente.telefono}
                </p>
                {cliente.documento && (
                  <p className="text-slate-500 flex items-center gap-2">
                    <FileText className="size-4" />
                    {cliente.documento} {cliente.tipo_documento && `(${cliente.tipo_documento})`}
                  </p>
                )}
                {cliente.email && (
                  <p className="text-slate-500 flex items-center gap-2">
                    <Mail className="size-4" />
                    {cliente.email}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* TRABAJO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="text-orange-500" />
                Trabajo solicitado
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-slate-700">
                {trabajo.trabajos_solicitados?.join(", ") || "Sin descripción"}
              </p>
            </CardContent>
          </Card>

          {/* NOTAS */}
          {trabajo.notas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-slate-500" />
                  Diagnóstico
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-slate-700">{trabajo.notas}</p>
              </CardContent>
            </Card>
          )}

          {/* TAREAS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-slate-500" />
                Tareas
              </CardTitle>
            </CardHeader>

            <CardContent>
              {trabajo.tareas && trabajo.tareas.length > 0 ? (
                <div className="space-y-2">
                  {trabajo.tareas.map((t) => (
                    <div className="flex items-center justify-between" key={t.id}>
                      <div className="flex items-center gap-2">
                        {t.realizada ? (
                          <CheckCircle className="text-emerald-500" />
                        ) : (
                          <Clock className="text-slate-400" />
                        )}
                        <div>
                          <div className="font-medium">{t.titulo}</div>
                          <div className="text-xs text-slate-500">{t.realizada ? 'Realizada' : 'Pendiente'}</div>
                        </div>
                      </div>

                      <div className="text-sm font-medium">
                        {t.costo?.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Sin tareas registradas</p>
              )}
            </CardContent>
          </Card>

          {/* SERVICE */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="text-blue-500" />
                Service
              </CardTitle>
            </CardHeader>

            <CardContent>
              {serviceSeleccionado ? (
                <div className="grid grid-cols-2 gap-4">
                  {serviceSeleccionado.aceite_utilizado && (
                    <div className="flex items-center gap-2">
                      <Droplets className="size-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Aceite</p>
                        <p className="font-medium">
                          {serviceSeleccionado.aceite_utilizado}
                        </p>
                      </div>
                    </div>
                  )}

                  {serviceSeleccionado.kilometraje_actual && (
                    <div className="flex items-center gap-2">
                      <Gauge className="size-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Km actual</p>
                        <p className="font-medium">
                          {serviceSeleccionado.kilometraje_actual.toLocaleString(
                            "es-AR",
                          )}{" "}
                          km
                        </p>
                      </div>
                    </div>
                  )}

                  {serviceSeleccionado.proximo_service_km && (
                    <div className="flex items-center gap-2">
                      <Gauge className="size-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">
                          Próximo service
                        </p>
                        <p className="font-medium">
                          {serviceSeleccionado.proximo_service_km.toLocaleString(
                            "es-AR",
                          )}{" "}
                          km
                        </p>
                      </div>
                    </div>
                  )}

                  {serviceSeleccionado.proxima_fecha_service && (
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Fecha próximo</p>
                        <p className="font-medium">
                          {formatFecha(
                            serviceSeleccionado.proxima_fecha_service,
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {serviceSeleccionado.observaciones && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 mb-1">
                        Observaciones
                      </p>
                      <p className="text-slate-700 text-sm">
                        {serviceSeleccionado.observaciones}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400">
                  <Wrench className="mx-auto mb-2 size-6" />
                  <p className="text-sm">No hay service registrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* DERECHA */}
        <div className="space-y-6">
          {/* ESTADO */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-blue-600" />
                Estado del trabajo
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <select
                value={estadoActual}
                onChange={(e) =>
                  setEstadoActual(e.target.value as EstadoTrabajo)
                }
                className="w-full p-2 border rounded"
              >
                {ESTADOS_TRABAJO.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>

              {estadoActual !== trabajo.estado && (
                <p className="text-xs text-amber-600">
                  Hay cambios sin guardar
                </p>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={estadoActual === trabajo.estado}
                onClick={handleActualizarEstado}
              >
                <CheckCircle className="mr-2" />
                Actualizar estado
              </Button>
            </CardContent>
          </Card>

          {/* ACCIONES */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPresupuesto(true)}
              >
                <FileText className="mr-2 text-orange-500" />
                Generar presupuesto
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowService(true)}
              >
                <Wrench className="mr-2 text-blue-500" />
                {serviceSeleccionado ? "Editar service" : "Registrar service"}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 text-slate-500" />
                Imprimir orden
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  cliente.email && window.open(`mailto:${cliente.email}`)
                }
              >
                <Mail className="mr-2 text-emerald-500" />
                Contactar cliente
              </Button>
            </CardContent>
          </Card>

          {/* ALERTA SI ES SEGURO */}
          {trabajo.tipo === "Seguro" && (
            <Card className="border-amber-300 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-amber-600" />
                  Seguro
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {trabajo.seguro && trabajo.seguro.length > 0 ? (
                  trabajo.seguro.map((s, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-sm text-slate-700">Siniestro: {s.numero_siniestro}</div>
                      {s.numero_poliza && <div className="text-sm text-slate-700">Póliza: {s.numero_poliza}</div>}
                      {s.numero_denuncia && <div className="text-sm text-slate-700">Denuncia: {s.numero_denuncia}</div>}
                      {s.monto_aprobado !== undefined && (
                        <div className="text-sm text-slate-700">Monto aprobado: {s.monto_aprobado.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</div>
                      )}
                      {s.aseguradora && <div className="text-sm text-slate-700">Aseguradora: {s.aseguradora.nombre}</div>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-700">Sin información de seguro</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showPresupuesto && (
        <PresupuestoModal
          trabajo={trabajo}
          onClose={() => setShowPresupuesto(false)}
        />
      )}

      <ModalService
        open={showService}
        trabajoId={trabajo.id}
        service={serviceSeleccionado ?? null}
        onClose={() => setShowService(false)}
      />
    </div>
  );
}

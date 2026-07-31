import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge, TipoBadge } from "../common/Badges";
import { PresupuestoModal } from "@/components/modals/PresupuestoModal";
import { ModalService } from "@/components/modals/ModalService";
import { useTrabajos } from "@/hooks/useTrabajos";
import {
  PRIORIDADES_TRABAJO,
  getPermisosEstadoTrabajo,
  getEstadosDisponibles,
  type EstadoTrabajo,
  type PrioridadTrabajo,
  type TareaTrabajoDraft,
  type TrabajoDetalle,
  type TrabajoDetalleDraft,
} from "@/types";

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
  Pencil,
  Flag,
} from "lucide-react";

import { obtenerColorVehiculo } from "@/utils/vehiculoColors";
import { ServiceCard } from "./ServiceCard";

import { sileo } from "sileo";
import { TrabajoSolicitadoCard } from "./editables/TrabajoSolicitadoCard";
import { TareasCard } from "./editables/TareasCard";
import { useTareas } from "@/hooks/useTareas";
import { useAuth } from "@/hooks/useAuth";

export function TrabajoDetalle() {
  const { id } = useParams();

  const { trabajoSeleccionado, updateTrabajo, fetchTrabajoById, loading } =
    useTrabajos();
  const { addTarea, updateTarea, removeTarea } = useTareas();

  const { currentUser } = useAuth();

const esAdmin = currentUser?.empleado?.is_admin === true;

  const [estadoActual, setEstadoActual] = useState<EstadoTrabajo>("Pendiente");
  const [prioridadActual, setPrioridadActual] = useState<
    PrioridadTrabajo | undefined
  >();
  const [showPresupuesto, setShowPresupuesto] = useState(false);
  const [showService, setShowService] = useState(false);
  const [editando, setEditando] = useState(false);
  const [draft, setDraft] = useState<TrabajoDetalleDraft | null>(null);
  const [pagadoActual, setPagadoActual] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchTrabajoById(id);
  }, [id]);

  useEffect(() => {
    if (!trabajoSeleccionado) return;

    setDraft(structuredClone(trabajoSeleccionado));
  }, [trabajoSeleccionado]);

  const updateDraft = <K extends keyof TrabajoDetalleDraft>(
    key: K,
    value: TrabajoDetalleDraft[K],
  ) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev,
    );
  };

  const recalcularPrecioTotal = (tareas: TareaTrabajoDraft[]) => {
    return tareas.reduce((total, tarea) => total + Number(tarea.costo || 0), 0);
  };

  const updateTareas = (tareas: TrabajoDetalleDraft["tareas"]) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            tareas,
            precio_total: recalcularPrecioTotal(tareas ?? []),
          }
        : prev,
    );
  };

  const handleToggleTarea = async (tareaId: string, realizada: boolean) => {
    try {
      await updateTarea(tareaId, {
        realizada,
      });

      setDraft((prev) =>
        prev
          ? {
              ...prev,
              tareas: prev.tareas?.map((tarea) =>
                tarea.id === tareaId
                  ? {
                      ...tarea,
                      realizada,
                    }
                  : tarea,
              ),
            }
          : prev,
      );

      sileo.success({
        title: realizada ? "Tarea completada" : "Tarea pendiente",
        description: realizada
          ? "La tarea fue marcada como realizada."
          : "La tarea volvió a estado pendiente.",
      });
    } catch (error) {
      console.error(error);

      sileo.error({
        title: "Error",
        description: "No se pudo actualizar el estado de la tarea.",
      });
    }
  };

  const handleDeleteTarea = (tarea: TareaTrabajoDraft) => {
    if (!draft?.tareas) return;

    if (tarea.id) {
      removeTarea(tarea.id);
    }

    updateTareas(draft.tareas.filter((t) => t !== tarea));
  };

  const trabajo = draft;
  const vehiculo = trabajo?.vehiculo;
  const cliente = trabajo?.vehiculo.cliente;

  const serviceSeleccionado = trabajo?.service;

  useEffect(() => {
    if (!trabajo) return;

    setEstadoActual(trabajo.estado);
    setPrioridadActual(trabajo.prioridad);
    setPagadoActual(trabajo.pagado);
  }, [trabajo]);

  const handleActualizarPrioridad = async () => {
    if (!trabajo || !prioridadActual) return;

    try {
      await updateTrabajo(trabajo.id, {
        prioridad: prioridadActual,
      });

      setDraft((prev) =>
        prev
          ? {
              ...prev,
              prioridad: prioridadActual,
            }
          : prev,
      );

      sileo.success({
        title: "Prioridad actualizada",
        description: "La prioridad fue actualizada correctamente.",
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "No se pudo actualizar la prioridad.",
      });
    }
  };

  const handleActualizarPago = async () => {
    if (!trabajo) return;

    try {
      const nuevoEstado = !pagadoActual;

      await updateTrabajo(trabajo.id, {
        pagado: nuevoEstado,
      });

      setPagadoActual(nuevoEstado);

      setDraft((prev) =>
        prev
          ? {
              ...prev,
              pagado: nuevoEstado,
            }
          : prev,
      );

      sileo.success({
        title: "Estado de pago actualizado",
        description: nuevoEstado
          ? "La orden fue marcada como pagada."
          : "La orden fue marcada como pendiente de pago.",
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "No se pudo actualizar el estado de pago.",
      });
    }
  };

  const confirmarActualizarPago = () => {
    if (!trabajo) return;

    sileo.action({
      title: pagadoActual
        ? "¿Marcar como pendiente de pago?"
        : "¿Marcar como pagada?",
      description: pagadoActual
        ? "La orden volverá a figurar como pendiente de pago."
        : "Esta acción indica que el taller recibió el pago de la orden.",
      button: {
        title: pagadoActual ? "Marcar como pendiente" : "Marcar como pagada",
        onClick: handleActualizarPago,
      },
    });
  };

  const handleCancelarEdicion = () => {
    if (trabajoSeleccionado) {
      setDraft(structuredClone(trabajoSeleccionado));
    }

    setEditando(false);
  };

  const handleGuardarTareas = async () => {
    if (!draft) return;

    const tareasActualizadas: TareaTrabajoDraft[] = [];

    for (const tarea of draft.tareas ?? []) {
      if (tarea.isNew) {
        const nuevaTarea = await addTarea({
          titulo: tarea.titulo,
          costo: tarea.costo,
          realizada: tarea.realizada,
          trabajo_id: draft.id,
        });

        tareasActualizadas.push({
          ...nuevaTarea,
          isNew: false,
        });
      } else if (tarea.id) {
        const tareaActualizada = await updateTarea(tarea.id, {
          titulo: tarea.titulo,
          costo: tarea.costo,
          realizada: tarea.realizada,
        });

        tareasActualizadas.push({
          ...tareaActualizada,
          isNew: false,
        });
      }
    }

    setDraft((prev) =>
      prev
        ? {
            ...prev,
            tareas: tareasActualizadas,
            precio_total: recalcularPrecioTotal(tareasActualizadas),
          }
        : prev,
    );
  };

  const handleGuardarCambios = async () => {
    if (!draft) return;

    try {
      await updateTrabajo(draft.id, {
        tipo: draft.tipo,
        fecha_ingreso: draft.fecha_ingreso,
        trabajos_solicitados: draft.trabajos_solicitados,
        notas: draft.notas,
        precio_total: draft.precio_total,
      });

      await handleGuardarTareas();

      sileo.success({
        title: "Cambios guardados",
        description: "La orden y las tareas fueron actualizadas correctamente.",
      });

      setEditando(false);
    } catch {
      sileo.error({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
      });
    }
  };

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleActualizarEstado = async () => {
    if (!trabajo) return;

    try {
      await updateTrabajo(trabajo.id, {
        estado: estadoActual,
      });

      sileo.success({
        title: "Estado actualizado",
        description: `El trabajo ahora está en "${estadoActual}".`,
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "No se pudo actualizar el estado.",
      });
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

  // 🔑 Permisos derivados del estado actual guardado (no del select en edición)
  const permisos = getPermisosEstadoTrabajo(trabajo.estado);
  const estadosDisponibles = getEstadosDisponibles(trabajo.estado);

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-6">
      <div className="rounded-2xl bg-linear-to-r from-slate-900 to-slate-800 text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/trabajos">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <ArrowLeft className="size-4 mr-2" />
              Volver
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <EstadoBadge estado={estadoActual} />
            <TipoBadge tipo={trabajo.tipo} />
          </div>
        </div>

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
              <span className="ml-3 text-sm text-slate-300">
                • {trabajo.prioridad}
              </span>
            )}
            <span
              className={`text-sm font-medium ${
                trabajo.pagado ? "text-green-300" : "text-amber-300"
              }`}
            >
              • {pagadoActual ? "Pagada" : "Pendiente de pago"}
            </span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                    {cliente.documento}{" "}
                    {cliente.tipo_documento && `(${cliente.tipo_documento})`}
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

          <TrabajoSolicitadoCard
            editando={editando && permisos.editarOrden}
            trabajosSolicitados={trabajo.trabajos_solicitados}
            onChange={(trabajos) =>
              updateDraft("trabajos_solicitados", trabajos)
            }
          />

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

          <TareasCard
            tareas={trabajo.tareas ?? []}
            editando={editando && permisos.editarOrden}
            puedeAgregar={permisos.agregarTareas}
            puedeEditar={permisos.editarTareas}
            puedeEliminar={permisos.eliminarTareas}
            puedeCambiarRealizada={permisos.marcarTareas}
            onChange={updateTareas}
            onToggleRealizada={handleToggleTarea}
            onDelete={handleDeleteTarea}
          />

          <ServiceCard
            service={serviceSeleccionado ?? null}
            estadoTrabajo={trabajo.estado}
          />
        </div>

        <div className="space-y-6">
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
                disabled={!permisos.editarEstado}
                className="w-full p-2 border rounded disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {estadosDisponibles.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>

              {!permisos.editarEstado && (
                <p className="text-xs text-slate-500">
                  Este estado no permite más cambios.
                </p>
              )}

              {permisos.editarEstado && estadoActual !== trabajo.estado && (
                <p className="text-xs text-amber-600">
                  Hay cambios sin guardar
                </p>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={
                  !permisos.editarEstado || estadoActual === trabajo.estado
                }
                onClick={handleActualizarEstado}
              >
                <CheckCircle className="mr-2" />
                Actualizar estado
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="text-amber-600" />
                Prioridad
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <select
                value={prioridadActual}
                onChange={(e) =>
                  setPrioridadActual(e.target.value as PrioridadTrabajo)
                }
                disabled={!permisos.editarPrioridad}
                className="w-full rounded border p-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {PRIORIDADES_TRABAJO.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad}
                  </option>
                ))}
              </select>

              {!permisos.editarPrioridad && (
                <p className="text-xs text-slate-500">
                  La prioridad no puede modificarse en este estado.
                </p>
              )}

              {permisos.editarPrioridad &&
                prioridadActual !== trabajo.prioridad && (
                  <p className="text-xs text-amber-600">
                    Hay cambios sin guardar
                  </p>
                )}

              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={
                  !permisos.editarPrioridad ||
                  prioridadActual === trabajo.prioridad
                }
                onClick={handleActualizarPrioridad}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Actualizar prioridad
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {permisos.editarOrden &&
                (!editando ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setEditando(true)}
                  >
                    <Pencil className="mr-2 text-amber-500" />
                    Editar orden
                  </Button>
                ) : (
                  <>
                    <Button
                      className="w-full justify-start"
                      onClick={handleGuardarCambios}
                    >
                      <CheckCircle className="mr-2" />
                      Guardar cambios
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleCancelarEdicion}
                    >
                      Cancelar edición
                    </Button>
                  </>
                ))}

              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={!esAdmin || !permisos.generarPresupuesto}
                onClick={() => setShowPresupuesto(true)}
              >
                <FileText className="mr-2 text-orange-500" />
                Generar presupuesto
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={confirmarActualizarPago}
                disabled={!esAdmin}
              >
                <CheckCircle
                  className={`mr-2 ${
                    pagadoActual ? "text-green-500" : "text-amber-500"
                  }`}
                />

                {pagadoActual ? "Marcar como pendiente" : "Marcar como pagada"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={!permisos.gestionarService}
                onClick={() => setShowService(true)}
              >
                <Wrench className="mr-2 text-blue-500" />
                {serviceSeleccionado ? "Editar service" : "Registrar service"}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={!esAdmin || !permisos.imprimir}
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
                      <div className="text-sm text-slate-700">
                        Siniestro: {s.numero_siniestro}
                      </div>
                      {s.numero_poliza && (
                        <div className="text-sm text-slate-700">
                          Póliza: {s.numero_poliza}
                        </div>
                      )}
                      {s.numero_denuncia && (
                        <div className="text-sm text-slate-700">
                          Denuncia: {s.numero_denuncia}
                        </div>
                      )}
                      {s.monto_aprobado !== undefined && (
                        <div className="text-sm text-slate-700">
                          Monto aprobado:{" "}
                          {s.monto_aprobado.toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </div>
                      )}
                      {s.aseguradora && (
                        <div className="text-sm text-slate-700">
                          Aseguradora: {s.aseguradora.nombre}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-700">
                    Sin información de seguro
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showPresupuesto && (
        <PresupuestoModal
          trabajo={{
            ...trabajo,
            tareas: trabajo.tareas?.map((tarea) => ({
              id: tarea.id!,
              titulo: tarea.titulo,
              costo: tarea.costo,
              realizada: tarea.realizada,
            })),
          }}
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

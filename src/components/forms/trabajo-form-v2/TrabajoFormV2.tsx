import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, ClipboardList, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

import type {
  Cliente,
  EstadoTrabajo,
  FormErrors,
  RepuestoService,
  TipoAceite,
  TipoTrabajo,
  Vehiculo,
  TareaTrabajo,
  TrabajoSolicitado,
  CreateTrabajoPayload,
  PrioridadTrabajo,
} from "@/types";

import { ModalCliente } from "../../modals/ModalCliente";
import { ModalVehiculo } from "../../modals/ModalVehiculo";

import { PasoClienteVehiculo } from "./PasoClienteVehiculo";
import { PasoOrden } from "./PasoOrden";
import { PasoTrabajo } from "./PasoTrabajo";

import { useClientes } from "@/hooks/useClientes";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useTrabajos } from "@/hooks/useTrabajos";
import { useAseguradoras } from "@/hooks/useAseguradoras";
import { useEmpleados } from "@/hooks/useEmpleados";

const STEPS = [
  { label: "Cliente y Vehículo" },
  { label: "Orden" },
  { label: "Trabajo" },
];

export function TrabajoFormV2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { clientes, fetchClientes } = useClientes();

  const {
    vehiculos,
    vehiculosByCliente,
    fetchVehiculosByCliente,
    fetchVehiculos,
    clearVehiculosByCliente,
  } = useVehiculos();

  const { aseguradoras, fetchAseguradoras } = useAseguradoras();
  const { addTrabajo } = useTrabajos();
  const { empleados, fetchEmpleados } = useEmpleados();

  // =========================
  // FETCH INICIAL
  // =========================
  useEffect(() => {
    fetchClientes();
    fetchVehiculos();
    fetchAseguradoras();
    fetchEmpleados();
  }, [fetchClientes, fetchVehiculos, fetchAseguradoras, fetchEmpleados]);

  // =========================
  // ESTADO GENERAL
  // =========================
  const [tipo, setTipo] = useState<TipoTrabajo>("Particular");
  const [estado, setEstado] = useState<EstadoTrabajo>("Pendiente");
  const [prioridad, setPrioridad] = useState<PrioridadTrabajo | undefined>(undefined);
  const [fecha_ingreso, setFechaIngreso] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [asignadoA, setAsignadoA] = useState<string | null>(null);

  // Cliente / Vehículo
  const [clienteId, setClienteId] = useState<string | undefined>(undefined);
  const [vehiculoId, setVehiculoId] = useState<string | undefined>(undefined);

  // =========================
  // VEHÍCULOS FILTRADOS
  // =========================
  const vehiculosFiltrados =
    clienteId && vehiculosByCliente.length > 0
      ? vehiculosByCliente
      : vehiculos;

  useEffect(() => {
    if (!clienteId) {
      clearVehiculosByCliente();
      return;
    }

    fetchVehiculosByCliente(clienteId);
  }, [clienteId, fetchVehiculosByCliente, clearVehiculosByCliente]);

  // =========================
  // SEGURO
  // =========================
  const [compania, setCompania] = useState<string | undefined>(undefined);
  const [numeroPoliza, setNumeroPoliza] = useState("");
  const [numeroDenuncia, setNumeroDenuncia] = useState("");
  const [numeroSiniestro, setNumeroSiniestro] = useState("");
  const [montoAprobado, setMontoAprobado] = useState("");

  // =========================
  // TRABAJO
  // =========================
  const [tipoAceite, setTipoAceite] = useState<TipoAceite | undefined>(undefined);
  const [repuestosService, setRepuestosService] = useState<RepuestoService[]>([]);
  const [kilometrajeActual, setKilometrajeActual] = useState("");
  const [otrosRepuestos, setOtrosRepuestos] = useState("");
  const [proximoServiceKm, setProximoServiceKm] = useState("");
  const [proximoServiceFecha, setProximoServiceFecha] = useState("");
  const [trabajos_solicitados, setTrabajosSolicitados] = useState<TrabajoSolicitado[]>([]);
  const [otro_trabajo, setOtroTrabajo] = useState("");
  const [tareas, setTareas] = useState<TareaTrabajo[]>([]);
  const [notas, setNotas] = useState("");

  // =========================
  // MODALS / ERRORES
  // =========================
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [modalVehiculoOpen, setModalVehiculoOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // =========================
  // DERIVADOS
  // =========================
  const totalTrabajo = tareas.reduce((acc, t) => acc + t.costo, 0);
  const tareasRealizadas = tareas.filter((t) => t.realizada).length;

  // =========================
  // HANDLERS
  // =========================
  const handleClienteCreado = (cliente: Cliente) => {
    setClienteId(cliente.id);
    setVehiculoId(undefined);
    setModalClienteOpen(false);
    clearError("clienteId");
    fetchClientes();
  };

  const handleVehiculoCreado = (vehiculo: Vehiculo) => {
    setVehiculoId(vehiculo.id);
    setModalVehiculoOpen(false);
    clearError("vehiculoId");
    if (clienteId) fetchVehiculosByCliente(clienteId);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      if (!clienteId) newErrors.clienteId = "Seleccione un cliente";
      if (!vehiculoId) newErrors.vehiculoId = "Seleccione un vehículo";
    }

    if (currentStep === 2 && tipo === "Seguro") {
      if (!compania) newErrors.compania = "Seleccione una compañía";
      if (!numeroSiniestro.trim())
        newErrors.numero_siniestro = "Ingrese el número de siniestro";
    }

    if (currentStep === 3) {
      if (tareas.length === 0) newErrors.tareas = "Agregue al menos una tarea";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (!validateStep(step)) return;
    if (!clienteId || !vehiculoId) return;

    const payload: CreateTrabajoPayload = {
      vehiculo_id: vehiculoId,
      tipo,
      estado,
      prioridad,
      fecha_ingreso,
      precio_total: totalTrabajo,
      trabajos_solicitados,
      tareas,
      notas: notas || undefined,
      seguro:
        tipo === "Seguro" && compania
          ? {
              aseguradora_id: compania,
              numero_poliza: numeroPoliza || undefined,
              numero_denuncia: numeroDenuncia || undefined,
              numero_siniestro: numeroSiniestro || undefined,
              monto_aprobado: montoAprobado ? Number(montoAprobado) : undefined,
            }
          : undefined,
      service: tipoAceite
        ? {
            aceite_utilizado: tipoAceite,
            kilometraje_actual: kilometrajeActual ? Number(kilometrajeActual) : undefined,
            repuestos: repuestosService,
            observaciones: otrosRepuestos || undefined,
            proximo_service_km: proximoServiceKm ? Number(proximoServiceKm) : undefined,
            proxima_fecha_service: proximoServiceFecha || undefined,
          }
        : undefined,
    };

    setSubmitting(true);

    try {
      await addTrabajo(payload);
      toast.success("Orden de trabajo creada exitosamente");
      navigate("/trabajos");
    } catch (err) {
      console.error(err);
      toast.error("Error al crear la orden de trabajo");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <ModalCliente
        open={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        onCreated={handleClienteCreado}
      />

      <ModalVehiculo
        open={modalVehiculoOpen}
        clientes={clientes}
        onClose={() => setModalVehiculoOpen(false)}
        onCreated={handleVehiculoCreado}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-4 pt-0 lg:px-6 lg:pb-6 lg:pt-0">
        <div className="overflow-hidden rounded-3xl border bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="shrink-0 rounded-2xl"
                onClick={() => navigate("/trabajos")}
              >
                <ArrowLeft className="size-5" />
              </Button>

              <div>
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  Nueva Orden de Trabajo
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:min-w-85">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-slate-300">
                  <ClipboardList className="size-4" />
                  <span className="text-xs uppercase">Tareas</span>
                </div>
                <p className="text-xl font-bold">{tareas.length}</p>
                <p className="text-xs text-slate-400">
                  {tareasRealizadas} completadas
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Shield className="size-4" />
                  <span className="text-xs uppercase">Total</span>
                </div>
                <p className="text-xl font-bold text-white">
                  ${totalTrabajo.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex border-t border-white/10">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`flex-1 py-2 text-center text-xs font-medium ${
                  step === i + 1
                    ? "bg-white/10 text-white"
                    : step > i + 1
                    ? "text-emerald-300"
                    : "text-slate-500"
                }`}
              >
                {i + 1}. {s.label}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <PasoClienteVehiculo
              clientes={clientes}
              vehiculos={vehiculosFiltrados}
              clienteId={clienteId}
              vehiculoId={vehiculoId}
              errors={errors}
              setClienteId={setClienteId}
              setVehiculoId={setVehiculoId}
              clearError={clearError}
              onNuevoCliente={() => setModalClienteOpen(true)}
              onNuevoVehiculo={() => setModalVehiculoOpen(true)}
            />
          )}

          {step === 2 && (
            <PasoOrden
              tipo={tipo}
              estado={estado}
              prioridad={prioridad}
              fecha_ingreso={fecha_ingreso}
              empleados={empleados}
              aseguradoras={aseguradoras}
              compania={compania}
              numeroPoliza={numeroPoliza}
              numeroDenuncia={numeroDenuncia}
              numeroSiniestro={numeroSiniestro}
              montoAprobado={montoAprobado}
              asignadoA={asignadoA}
              errors={errors}
              setTipo={setTipo}
              setEstado={setEstado}
              setPrioridad={setPrioridad}
              setFechaIngreso={setFechaIngreso}
              setCompania={setCompania}
              setNumeroPoliza={setNumeroPoliza}
              setNumeroDenuncia={setNumeroDenuncia}
              setNumeroSiniestro={setNumeroSiniestro}
              setMontoAprobado={setMontoAprobado}
              setAsignadoA={setAsignadoA}
              clearError={clearError}
            />
          )}

          {step === 3 && (
            <PasoTrabajo
              tipoAceite={tipoAceite}
              repuestosService={repuestosService}
              otrosRepuestos={otrosRepuestos}
              proximoServiceKm={proximoServiceKm}
              proximoServiceFecha={proximoServiceFecha}
              trabajos_solicitados={trabajos_solicitados}
              otro_trabajo={otro_trabajo}
              tareas={tareas}
              notas={notas}
              errors={errors}
              setTipoAceite={setTipoAceite}
              setRepuestosService={setRepuestosService}
              setOtrosRepuestos={setOtrosRepuestos}
              setProximoServiceKm={setProximoServiceKm}
              setProximoServiceFecha={setProximoServiceFecha}
              setTrabajosSolicitados={setTrabajosSolicitados}
              setKilometrajeActual={setKilometrajeActual}
              setOtroTrabajo={setOtroTrabajo}
              setTareas={setTareas}
              setNotas={setNotas}
              clearError={clearError}
            />
          )}

          <div className="flex flex-col gap-4 rounded-3xl border bg-background/95 p-5 shadow-2xl lg:flex-row lg:justify-between">
            <div>
              <h3 className="font-semibold">Resumen del trabajo</h3>
              <p className="text-sm text-muted-foreground">
                {tareas.length} tareas · $
                {totalTrabajo.toLocaleString("es-AR")}
              </p>
            </div>

            <div className="flex gap-3">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Atrás
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/trabajos")}
                >
                  Cancelar
                </Button>
              )}

              {step < STEPS.length ? (
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  <Save className="mr-2 size-5" />
                  {submitting ? "Creando..." : "Crear Orden"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
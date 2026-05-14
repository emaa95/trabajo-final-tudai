import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  ArrowLeft,
  Save,
  ClipboardList,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  clientes as clientesIniciales,
  vehiculos as vehiculosIniciales,
} from "@/data";

import type {
  Cliente,
  EstadoSeguro,
  EstadoTrabajo,
  FormErrors,
  TipoTrabajo,
  Trabajo,
  Vehiculo,
  TareaTrabajo,
} from "@/types";

import { ModalCliente } from "./ModalCliente";

import { ModalVehiculo } from "./ModalVehiculo";

import { SeccionCliente } from "./SeccionCliente";

import { SeccionGeneral } from "./SeccionGeneral";

import { SeccionSeguro } from "./SeccionSeguro";

import { SeccionTareas } from "./SeccionTareas";

export function TrabajoForm() {
  const [clientes, setClientes] =
    useState<Cliente[]>(clientesIniciales);

  const [vehiculosExtra, setVehiculosExtra] =
    useState<Vehiculo[]>([]);

  const [tipo, setTipo] =
    useState<TipoTrabajo>("Particular");

  const [estado, setEstado] =
    useState<EstadoTrabajo>("Pendiente");

  const [clienteId, setClienteId] = useState<
    string | undefined
  >(undefined);

  const [vehiculoId, setVehiculoId] = useState<
    string | undefined
  >(undefined);

  const [fechaIngreso, setFechaIngreso] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [tareas, setTareas] = useState<
    TareaTrabajo[]
  >([]);

  const [notas, setNotas] = useState("");

  const [compania, setCompania] = useState<
    string | undefined
  >(undefined);

  const [numeroSiniestro, setNumeroSiniestro] =
    useState("");

  const [estadoSeguro, setEstadoSeguro] =
    useState<EstadoSeguro>("Pendiente");

  const [montoAprobado, setMontoAprobado] =
    useState("");

  const [modalClienteOpen, setModalClienteOpen] =
    useState(false);

  const [modalVehiculoOpen, setModalVehiculoOpen] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const vehiculosBase = vehiculosIniciales.filter(
    (vehiculo) =>
      vehiculo.clienteId === clienteId
  );

  const vehiculosNuevos = vehiculosExtra.filter(
    (vehiculo) =>
      vehiculo.clienteId === clienteId
  );

  const vehiculosDisponibles = [
    ...vehiculosBase,
    ...vehiculosNuevos,
  ];

  const clearError = (
    field: keyof FormErrors
  ) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleClienteCreado = (
    cliente: Cliente
  ) => {
    setClientes((prev) => [
      ...prev,
      cliente,
    ]);

    setClienteId(cliente.id);

    setVehiculoId(undefined);

    setModalClienteOpen(false);

    clearError("clienteId");
  };

  const handleVehiculoCreado = (
    vehiculo: Vehiculo
  ) => {
    setVehiculosExtra((prev) => [
      ...prev,
      vehiculo,
    ]);

    setVehiculoId(vehiculo.id);

    setModalVehiculoOpen(false);

    clearError("vehiculoId");
  };

  const totalTrabajo = tareas.reduce(
    (acc, tarea) =>
      acc + tarea.costo,
    0
  );

  const tareasRealizadas =
    tareas.filter(
      (tarea) => tarea.realizada
    ).length;

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!clienteId) {
      newErrors.clienteId =
        "Seleccione un cliente";
    }

    if (!vehiculoId) {
      newErrors.vehiculoId =
        "Seleccione un vehículo";
    }

    if (tareas.length === 0) {
      newErrors.tareas =
        "Agregue al menos una tarea";
    }

    if (tipo === "Seguro") {
      if (!compania) {
        newErrors.compania =
          "Seleccione una compañía";
      }

      if (!numeroSiniestro.trim()) {
        newErrors.numeroSiniestro =
          "Ingrese el número de siniestro";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) return;

    if (!clienteId || !vehiculoId) return;

    const nuevoTrabajo: Trabajo = {
      id: `T-${Date.now()}`,

      clienteId,

      vehiculoId,

      tipo,

      estado,

      fechaIngreso,

      tareas,

      notas: notas || undefined,

      seguro:
        tipo === "Seguro"
          ? {
              id: `S-${Date.now()}`,

              compania: compania ?? "",

              numeroSiniestro,

              estado: estadoSeguro,

              montoAprobado:
                parseFloat(montoAprobado) || 0,
            }
          : undefined,
    };

    console.log(nuevoTrabajo);

    toast.success(
      "Orden de trabajo creada exitosamente"
    );
  };

  const navigate = useNavigate();

  return (
    <>
      <ModalCliente
        open={modalClienteOpen}
        onClose={() =>
          setModalClienteOpen(false)
        }
        onCreated={handleClienteCreado}
      />

      <ModalVehiculo
        open={modalVehiculoOpen}
        clienteId={clienteId ?? ""}
        onClose={() =>
          setModalVehiculoOpen(false)
        }
        onCreated={handleVehiculoCreado}
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
        <div className="overflow-hidden rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
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
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                  <ClipboardList className="size-3.5" />
                  Gestión de órdenes
                </div>

                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  Nueva Orden de Trabajo
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-300 lg:text-base">
                  Cree una nueva orden y gestione
                  tareas, costos y estado general
                  del trabajo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:min-w-[340px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-slate-300">
                  <ClipboardList className="size-4" />

                  <span className="text-xs uppercase tracking-wide">
                    Tareas
                  </span>
                </div>

                <p className="mt-2 text-3xl font-bold">
                  {tareas.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {
                    tareasRealizadas
                  }{" "}
                  completadas
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Shield className="size-4" />

                  <span className="text-xs uppercase tracking-wide">
                    Total
                  </span>
                </div>

                <p className="mt-2 text-3xl font-bold text-white">
                  $
                  {totalTrabajo.toLocaleString(
                    "es-AR"
                  )}
                </p>

                <p className="mt-1 text-xs text-emerald-200/80">
                  Estimado del trabajo
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <SeccionGeneral
            tipo={tipo}
            estado={estado}
            fechaIngreso={fechaIngreso}
            onTipoChange={(value) => {
              if (!value) return;

              setTipo(value);
            }}
            onEstadoChange={(value) => {
              if (!value) return;

              setEstado(value);
            }}
            onFechaIngresoChange={
              setFechaIngreso
            }
          />

          <SeccionCliente
            clientes={clientes}
            vehiculos={vehiculosDisponibles}
            clienteId={clienteId}
            vehiculoId={vehiculoId}
            clienteError={errors.clienteId}
            vehiculoError={errors.vehiculoId}
            onClienteChange={(value) => {
              if (!value) return;

              setClienteId(value);

              setVehiculoId(undefined);

              clearError("clienteId");
            }}
            onVehiculoChange={(value) => {
              if (!value) return;

              setVehiculoId(value);

              clearError("vehiculoId");
            }}
            onNuevoCliente={() =>
              setModalClienteOpen(true)
            }
            onNuevoVehiculo={() =>
              setModalVehiculoOpen(true)
            }
          />

          <SeccionTareas
            tareas={tareas}
            notas={notas}
            error={errors.tareas}
            onNotasChange={setNotas}
            onChange={(value) => {
              setTareas(value);

              clearError("tareas");
            }}
          />

          {tipo === "Seguro" && (
            <SeccionSeguro
              compania={compania}
              numeroSiniestro={
                numeroSiniestro
              }
              estadoSeguro={
                estadoSeguro
              }
              montoAprobado={
                montoAprobado
              }
              errors={errors}
              onCompaniaChange={(value) => {
                if (!value) return;

                setCompania(value);

                clearError(
                  "compania"
                );
              }}
              onNumeroSiniestroChange={(
                value
              ) => {
                setNumeroSiniestro(
                  value
                );

                clearError(
                  "numeroSiniestro"
                );
              }}
              onEstadoSeguroChange={(
                value
              ) => {
                if (!value) return;

                setEstadoSeguro(value);
              }}
              onMontoAprobadoChange={
                setMontoAprobado
              }
            />
          )}

          <div className="bottom-4 z-20">
            <div className="flex flex-col gap-4 rounded-3xl border bg-background/95 p-5 shadow-2xl backdrop-blur lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-semibold">
                  Resumen del trabajo
                </h3>

                <p className="text-sm text-muted-foreground">
                  {tareas.length} tareas · $
                  {totalTrabajo.toLocaleString(
                    "es-AR"
                  )}{" "}
                  estimados
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-2xl px-8"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base shadow-lg hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="mr-2 size-5" />
                  Crear Orden
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
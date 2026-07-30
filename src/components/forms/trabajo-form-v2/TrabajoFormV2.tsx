import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, ClipboardList, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FormProvider, useForm, type Path } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { sileo } from "sileo";

import { trabajoSchema, type TrabajoFormData } from "@/schemas/trabajoSchema";

import type { Cliente, Vehiculo, CreateTrabajoPayload } from "@/types";

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

const STEP_FIELDS: Record<number, Path<TrabajoFormData>[]> = {
  1: ["cliente_id", "vehiculo_id"],
  2: ["fecha_ingreso", "tipo", "estado", "prioridad"],
  3: ["trabajos_solicitados", "tareas"],
};

const defaultValues: TrabajoFormData = {
  cliente_id: "",
  vehiculo_id: "",
  tipo: "Particular",
  estado: "Pendiente",
  prioridad: "Baja",
  fecha_ingreso: new Date().toISOString().split("T")[0],

  trabajos_solicitados: [],

  tareas: [],

  notas: "",

  asignado_a: undefined,

  seguro: undefined,
};

export function TrabajoFormV2() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [modalClienteOpen, setModalClienteOpen] = useState(false);

  const [modalVehiculoOpen, setModalVehiculoOpen] = useState(false);

  const { clientes, fetchClientes } = useClientes();

  const {
    vehiculos,
    vehiculosByCliente,
    fetchVehiculos,
    fetchVehiculosByCliente,
    clearVehiculosByCliente,
  } = useVehiculos();

  const { aseguradoras, fetchAseguradoras } = useAseguradoras();

  const { empleados, fetchEmpleados } = useEmpleados();

  const { addTrabajo } = useTrabajos();

  const methods = useForm<
    z.input<typeof trabajoSchema>,
    unknown,
    TrabajoFormData
  >({
    resolver: zodResolver(trabajoSchema),
    defaultValues,
    mode: "onBlur",
  });

  const { watch, setValue, trigger, handleSubmit } = methods;

  const clienteId = watch("cliente_id");

  const tipo = watch("tipo");

  const tareas = watch("tareas") ?? [];

  useEffect(() => {
    fetchClientes();
    fetchVehiculos();
    fetchAseguradoras();
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (!clienteId) {
      clearVehiculosByCliente();
      return;
    }

    fetchVehiculosByCliente(clienteId);
  }, [clienteId]);

  const vehiculosFiltrados = clienteId ? vehiculosByCliente : vehiculos;

  const totalTrabajo = tareas.reduce((acc, tarea) => acc + tarea.costo, 0);

  const tareasRealizadas = tareas.filter((tarea) => tarea.realizada).length;

  const handleClienteCreado = (cliente: Cliente) => {
    setValue("cliente_id", cliente.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("vehiculo_id", "", {
      shouldValidate: true,
    });

    setModalClienteOpen(false);

    fetchClientes();
  };

  const handleVehiculoCreado = (vehiculo: Vehiculo) => {
    setValue("vehiculo_id", vehiculo.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setModalVehiculoOpen(false);

    if (clienteId) {
      fetchVehiculosByCliente(clienteId);
    }
  };

  const handleNext = async () => {
    const fields = [...STEP_FIELDS[step]];

    if (step === 2 && tipo === "Seguro") {
      fields.push("seguro.aseguradora_id", "seguro.numero_siniestro");
    }

    const valid = await trigger(fields);

    if (valid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: TrabajoFormData) => {
    if (submitting) return;

    const payload: CreateTrabajoPayload = {
      vehiculo_id: data.vehiculo_id,

      tipo: data.tipo,

      estado: data.estado,

      prioridad: data.prioridad,

      fecha_ingreso: data.fecha_ingreso,

      precio_total: totalTrabajo,

      trabajos_solicitados: data.trabajos_solicitados,

      tareas: data.tareas.map((tarea) => ({
        titulo: tarea.titulo,
        costo: tarea.costo,
        realizada: tarea.realizada,
      })),

      notas: data.notas || undefined,

      asignado_a: data.asignado_a || undefined,

      seguro:
        data.tipo === "Seguro" && data.seguro?.aseguradora_id
          ? {
              aseguradora_id: data.seguro.aseguradora_id,

              numero_poliza: data.seguro.numero_poliza || undefined,

              numero_denuncia: data.seguro.numero_denuncia || undefined,

              numero_siniestro: data.seguro.numero_siniestro || undefined,

              monto_aprobado: data.seguro.monto_aprobado,
            }
          : undefined,
    };

    setSubmitting(true);

    try {
      await addTrabajo(payload);

      sileo.success({
        title: "Orden creada",
        description: "La orden de trabajo fue creada exitosamente.",
      });

      navigate("/trabajos");
    } catch (error) {
      console.error(error);

      sileo.error({
        title: "Error",
        description: "No se pudo crear la orden de trabajo.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = () => {
    sileo.warning({
      title: "Formulario incompleto",
      description: "Revisá los campos marcados en rojo.",
    });
  };

  return (
    <FormProvider {...methods}>
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

      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-4 pt-0 lg:px-6">
        <div className="overflow-hidden rounded-3xl border bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => navigate("/trabajos")}
              >
                <ArrowLeft className="size-5" />
              </Button>

              <h1 className="text-3xl font-bold">Nueva Orden de Trabajo</h1>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
                  Total
                </div>

                <p className="text-xl font-bold">
                  ${totalTrabajo.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex border-t border-white/10">
            {STEPS.map((item, index) => (
              <div
                key={item.label}
                className={`flex-1 py-2 text-center text-xs ${
                  step === index + 1
                    ? "bg-white/10 text-white"
                    : "text-slate-500"
                }`}
              >
                {index + 1}. {item.label}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
        >
          {step === 1 && (
            <PasoClienteVehiculo
              clientes={clientes}
              vehiculos={vehiculosFiltrados}
              onNuevoCliente={() => setModalClienteOpen(true)}
              onNuevoVehiculo={() => setModalVehiculoOpen(true)}
            />
          )}

          {step === 2 && (
            <PasoOrden empleados={empleados} aseguradoras={aseguradoras} />
          )}

          {step === 3 && <PasoTrabajo />}

          <div className="flex justify-between rounded-3xl border bg-background p-5 shadow-xl">
            <div>
              <h3 className="font-semibold">Resumen del trabajo</h3>

              <p className="text-sm text-muted-foreground">
                {tareas.length} tareas · ${totalTrabajo.toLocaleString("es-AR")}
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
    </FormProvider>
  );
}
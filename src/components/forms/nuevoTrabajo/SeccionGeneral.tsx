import { useFormContext, useWatch } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FileText } from "lucide-react";

import {
  ESTADOS_TRABAJO,
  PRIORIDADES_TRABAJO,
  type EstadoTrabajo,
  type PrioridadTrabajo,
  type TipoTrabajo,
  type Empleado,
} from "@/types";

import type { TrabajoFormData } from "@/schemas/trabajoSchema";

interface SeccionGeneralProps {
  empleados: Empleado[];
}

export function SeccionGeneral({ empleados }: SeccionGeneralProps) {
  const { control, setValue, register } = useFormContext<TrabajoFormData>();

  const tipo =
    useWatch({
      control,
      name: "tipo",
    }) ?? "";

  const estado =
    useWatch({
      control,
      name: "estado",
    }) ?? "";

  const prioridad =
    useWatch({
      control,
      name: "prioridad",
    }) ?? "";

  const asignadoA =
    useWatch({
      control,
      name: "asignado_a",
    }) ?? undefined;

  // Solo empleados activos para nuevas asignaciones
  const empleadosActivos = empleados.filter(
    (empleado) => empleado.activo,
  );

  const empleadosOrdenados = [...empleadosActivos].sort((a, b) =>
    a.apellido.localeCompare(b.apellido),
  );

  // Busca en todos los empleados para conservar responsables históricos
  const responsableSeleccionado = empleados.find(
    (empleado) => empleado.id === asignadoA,
  );

  return (
    <Card className="border-border/60 bg-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <FileText className="size-5" />
          Información General
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-5">
        {/* TIPO */}
        <div className="space-y-2">
          <Label>Tipo de Trabajo</Label>

          <Select
            value={tipo}
            onValueChange={(value) =>
              setValue("tipo", value as TipoTrabajo, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Particular">Particular</SelectItem>
              <SelectItem value="Seguro">Seguro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ESTADO */}
        <div className="space-y-2">
          <Label>Estado</Label>

          <Select
            value={estado}
            onValueChange={(value) =>
              setValue("estado", value as EstadoTrabajo, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {ESTADOS_TRABAJO.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PRIORIDAD */}
        <div className="space-y-2">
          <Label>Prioridad</Label>

          <Select
            value={prioridad}
            onValueChange={(value) =>
              setValue("prioridad", value as PrioridadTrabajo, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PRIORIDADES_TRABAJO.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* RESPONSABLE */}
        <div className="space-y-2">
          <Label>Responsable</Label>

          <Select
            value={asignadoA ?? "none"}
            onValueChange={(value) => {
              const nextValue =
                value && value !== "none" ? value : undefined;

              setValue("asignado_a", nextValue, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccionar responsable">
                {responsableSeleccionado
                  ? `${responsableSeleccionado.nombre} ${
                      responsableSeleccionado.apellido
                    }${
                      !responsableSeleccionado.activo
                        ? " (inactivo)"
                        : ""
                    }`
                  : "Sin responsable"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">
                Sin responsable
              </SelectItem>

              {empleadosOrdenados.map((empleado) => (
                <SelectItem key={empleado.id} value={empleado.id}>
                  {empleado.nombre} {empleado.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FECHA */}
        <div className="space-y-2">
          <Label htmlFor="fecha_ingreso">
            Fecha de ingreso
          </Label>

          <Input
            id="fecha_ingreso"
            type="date"
            {...register("fecha_ingreso")}
            className="bg-background"
          />
        </div>
      </CardContent>
    </Card>
  );
}
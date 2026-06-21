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

import type {
  EstadoTrabajo,
  TipoTrabajo,
  PrioridadTrabajo,
  SeccionGeneralProps,
} from "@/types";

import { ESTADOS_TRABAJO, PRIORIDADES_TRABAJO } from "@/types";

export function SeccionGeneral({
  tipo,
  estado,
  prioridad,
  fechaIngreso,
  asignadoA,
  empleados,
  onTipoChange,
  onEstadoChange,
  onPrioridadChange,
  onFechaIngresoChange,
  onAsignadoAChange,
}: SeccionGeneralProps) {
  const empleadosOrdenados = [...(empleados ?? [])].sort((a, b) =>
    a.apellido.localeCompare(b.apellido),
  );

  const responsableValue = asignadoA ?? "none";
  const responsableSeleccionado = empleadosOrdenados.find(
    (e) => e.id === asignadoA,
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
        {/* Tipo de trabajo */}
        <div className="space-y-2">
          <Label>Tipo de Trabajo</Label>

          <Select
            value={tipo ?? ""}
            onValueChange={(value) => {
              if (!value) return;
              onTipoChange(value as TipoTrabajo);
            }}
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

        {/* Estado */}
        <div className="space-y-2">
          <Label>Estado</Label>

          <Select
            value={estado ?? ""}
            onValueChange={(value) => {
              if (!value) return;
              onEstadoChange(value as EstadoTrabajo);
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>

            <SelectContent>
              {ESTADOS_TRABAJO.map((estadoItem) => (
                <SelectItem key={estadoItem} value={estadoItem}>
                  {estadoItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <Label>Prioridad</Label>

          <Select
            value={prioridad ?? ""}
            onValueChange={(value) => {
              if (!value) return;
              onPrioridadChange(value as PrioridadTrabajo);
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccionar prioridad">
                {prioridad}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {PRIORIDADES_TRABAJO.map((prioridadItem) => (
                <SelectItem key={prioridadItem} value={prioridadItem}>
                  {prioridadItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Responsable */}
        <div className="space-y-2">
          <Label>Responsable</Label>

          <Select
            value={responsableValue}
            onValueChange={(value) =>
              onAsignadoAChange(value === "none" ? null : value)
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccionar responsable">
                {responsableSeleccionado
                  ? `${responsableSeleccionado.nombre} ${responsableSeleccionado.apellido}`
                  : undefined}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">Sin responsable</SelectItem>

              {empleadosOrdenados.map((empleado) => (
                <SelectItem key={empleado.id} value={empleado.id}>
                  {empleado.nombre} {empleado.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha ingreso */}
        <div className="space-y-2">
          <Label htmlFor="fechaIngreso">Fecha de ingreso</Label>

          <Input
            id="fechaIngreso"
            type="date"
            value={fechaIngreso ?? ""}
            onChange={(e) => onFechaIngresoChange(e.target.value)}
            className="bg-background"
          />
        </div>
      </CardContent>
    </Card>
  );
}

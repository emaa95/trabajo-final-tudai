// components/trabajos/seccion-general.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  SeccionGeneralProps,
} from "@/types";

export function SeccionGeneral({
  tipo,
  estado,
  fechaIngreso,
  onTipoChange,
  onEstadoChange,
  onFechaIngresoChange,
}: SeccionGeneralProps) {
  return (
    <Card className="border-border/60 bg-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <FileText className="size-5" />
          Información General
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 flex justify-between">
        <div className="space-y-2">
          <Label>Tipo de Trabajo</Label>

          <Select
            value={tipo}
            onValueChange={(value) => {
              if (!value) return;

              onTipoChange(
                value as TipoTrabajo
              );
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Particular">
                Particular
              </SelectItem>

              <SelectItem value="Seguro">
                Seguro
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Estado Inicial</Label>

          <Select
            value={estado}
            onValueChange={(value) => {
              if (!value) return;

              onEstadoChange(
                value as EstadoTrabajo
              );
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Pendiente">
                Pendiente
              </SelectItem>

              <SelectItem value="En reparación">
                En reparación
              </SelectItem>

              <SelectItem value="En pintura">
                En pintura
              </SelectItem>

              <SelectItem value="Pausada">
                Pausada
              </SelectItem>

              <SelectItem value="Listo para entregar">
                Listo para entregar
              </SelectItem>

              <SelectItem value="Entregado">
                Entregado
              </SelectItem>

              <SelectItem value="Cancelada">
                Cancelada
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaIngreso">
            Fecha de ingreso
          </Label>

          <Input
            id="fechaIngreso"
            type="date"
            value={fechaIngreso}
            onChange={(e) =>
              onFechaIngresoChange(
                e.target.value
              )
            }
            className="bg-background"
          />
        </div>
      </CardContent>
    </Card>
  );
}
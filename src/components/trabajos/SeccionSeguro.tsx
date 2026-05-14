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

import { Shield } from "lucide-react";

import { companiasSeguros } from "@/data";

import { FieldError } from "./FieldError";

import type {
  EstadoSeguro,
  SeccionSeguroProps,
} from "@/types";

export function SeccionSeguro({
  compania,
  numeroSiniestro,
  estadoSeguro,
  montoAprobado,
  errors,
  onCompaniaChange,
  onNumeroSiniestroChange,
  onEstadoSeguroChange,
  onMontoAprobadoChange,
}: SeccionSeguroProps) {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/40 dark:border-blue-950 dark:from-blue-950/30 dark:to-blue-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
          <Shield className="size-5" />
          Información del Seguro
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Compañía *</Label>

          <Select
            value={compania}
            onValueChange={(value) => {
              onCompaniaChange(value);
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccione una compañía" />
            </SelectTrigger>

            <SelectContent>
              {companiasSeguros.map(
                (cia) => (
                  <SelectItem
                    key={cia.id}
                    value={cia.nombre}
                  >
                    {cia.nombre}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <FieldError
            error={errors.compania}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siniestro">
            Número de siniestro *
          </Label>

          <Input
            id="siniestro"
            placeholder="Ej: LC-2026-001234"
            value={numeroSiniestro}
            onChange={(e) =>
              onNumeroSiniestroChange(
                e.target.value
              )
            }
            className="bg-background"
          />

          <FieldError
            error={errors.numeroSiniestro}
          />
        </div>

        <div className="space-y-2">
          <Label>Estado del seguro</Label>

          <Select
            value={estadoSeguro}
            onValueChange={(value) => {
              if (!value) return;

              onEstadoSeguroChange(
                value as EstadoSeguro
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

              <SelectItem value="Aprobado">
                Aprobado
              </SelectItem>

              <SelectItem value="Rechazado">
                Rechazado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monto">
            Monto aprobado
          </Label>

          <Input
            id="monto"
            type="number"
            placeholder="0"
            value={montoAprobado}
            onChange={(e) =>
              onMontoAprobadoChange(
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
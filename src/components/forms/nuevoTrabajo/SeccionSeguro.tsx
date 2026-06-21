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

import { FieldError } from "./FieldError";

import type { SeccionSeguroProps } from "@/types";

export function SeccionSeguro({
  aseguradoras,
  compania,
  numero_poliza,
  numero_siniestro,
  numero_denuncia,
  monto_aprobado,
  errors,
  onCompaniaChange,
  onNumeroPolizaChange,
  onNumeroSiniestroChange,
  onNumeroDenunciaChange,
  onMontoAprobadoChange,
}: SeccionSeguroProps) {
  const companiaSeleccionada = aseguradoras.find(
  (a) => a.id === compania
);
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
  value={compania ?? ""}
  onValueChange={onCompaniaChange}
>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccione una compañía">
  {companiaSeleccionada?.nombre}
</SelectValue>
            </SelectTrigger>

            <SelectContent>
              {aseguradoras.map((aseguradora) => (
                <SelectItem
                  key={aseguradora.id}
                  value={aseguradora.id}
                >
                  {aseguradora.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldError error={errors.compania} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero_poliza">
            Número de póliza
          </Label>

          <Input
            id="numero_poliza"
            placeholder="Ej: POL-123456"
            value={numero_poliza}
            onChange={(e) =>
              onNumeroPolizaChange(
                e.target.value
              )
            }
            className="bg-background"
          />

          <FieldError
            error={errors.numero_poliza}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero_denuncia">
            Número de denuncia
          </Label>

          <Input
            id="numero_denuncia"
            placeholder="Ej: DEN-2026-001234"
            value={numero_denuncia}
            onChange={(e) =>
              onNumeroDenunciaChange(
                e.target.value
              )
            }
            className="bg-background"
          />

          <FieldError
            error={errors.numero_denuncia}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero_siniestro">
            Número de siniestro *
          </Label>

          <Input
            id="numero_siniestro"
            placeholder="Ej: SIN-2026-001234"
            value={numero_siniestro}
            onChange={(e) =>
              onNumeroSiniestroChange(
                e.target.value
              )
            }
            className="bg-background"
          />

          <FieldError
            error={errors.numero_siniestro}
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="monto_aprobado">
            Monto aprobado
          </Label>

          <Input
            id="monto_aprobado"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={monto_aprobado}
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
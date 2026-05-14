// components/trabajos/seccion-descripcion.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Car } from "lucide-react";

import { FieldError } from "./FieldError";

import type {
  SeccionDescripcionProps,
} from "@/types";

export function SeccionDescripcion({
  descripcionDano,
  notas,
  error,
  onDescripcionChange,
  onNotasChange,
}: SeccionDescripcionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="size-5" />
          Descripción del Trabajo
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="descripcion">
            Descripción del daño *
          </Label>

          <Textarea
            id="descripcion"
            placeholder="Describa detalladamente los daños..."
            value={descripcionDano}
            onChange={(e) =>
              onDescripcionChange(
                e.target.value
              )
            }
            className={`min-h-[140px] ${
              error
                ? "border-destructive"
                : ""
            }`}
          />

          <FieldError error={error} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notas">
            Notas adicionales
          </Label>

          <Textarea
            id="notas"
            placeholder="Notas internas..."
            value={notas}
            onChange={(e) =>
              onNotasChange(e.target.value)
            }
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
import {
  TRABAJOS_SOLICITADOS,
  type TrabajoSolicitado,
} from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Wrench } from "lucide-react";

interface TrabajoSolicitadoCardProps {
  trabajosSolicitados: TrabajoSolicitado[];
  editando: boolean;
  onChange: (value: TrabajoSolicitado[]) => void;
}

export function TrabajoSolicitadoCard({
  trabajosSolicitados,
  editando,
  onChange,
}: TrabajoSolicitadoCardProps) {
  const toggleTrabajo = (
    trabajo: TrabajoSolicitado,
  ) => {
    const seleccionado =
      trabajosSolicitados.includes(trabajo);

    const nuevosTrabajos = seleccionado
      ? trabajosSolicitados.filter(
          (item) => item !== trabajo,
        )
      : [
          ...trabajosSolicitados,
          trabajo,
        ];

    onChange(nuevosTrabajos);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="text-orange-500" />
          Trabajo solicitado
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!editando ? (
          <p className="text-slate-700">
            {trabajosSolicitados.length > 0
              ? trabajosSolicitados.join(", ")
              : "Sin trabajos registrados"}
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {TRABAJOS_SOLICITADOS.map((trabajo) => {
              const checkboxId = `trabajo-${trabajo}`;

              return (
                <div
                  key={trabajo}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={trabajosSolicitados.includes(
                      trabajo,
                    )}
                    onCheckedChange={() =>
                      toggleTrabajo(trabajo)
                    }
                  />

                  <Label
                    htmlFor={checkboxId}
                    className="cursor-pointer"
                  >
                    {trabajo}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
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

import {
  Calendar,
  Flag,
  Info,
} from "lucide-react";

import {
  PRIORIDADES_TRABAJO,
  type PrioridadTrabajo,
  type TipoTrabajo,
} from "@/types";

interface InformacionGeneralCardProps {
  editando: boolean;

  tipo: TipoTrabajo;

  prioridad?: PrioridadTrabajo;

  fechaIngreso: string;

  onPrioridadChange: (
    prioridad: PrioridadTrabajo
  ) => void;
}

export function InformacionGeneralCard({
  editando,
  tipo,
  prioridad,
  fechaIngreso,
  onPrioridadChange,
}: InformacionGeneralCardProps) {
  const fecha = new Date(
    fechaIngreso,
  ).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-sky-500" />
          Información general
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Tipo */}
        <div>
          <p className="text-sm text-muted-foreground">
            Tipo
          </p>

          <p className="font-medium">
            {tipo}
          </p>
        </div>

        {/* Fecha */}
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-sm text-muted-foreground">
              Fecha de ingreso
            </p>

            <p className="font-medium">
              {fecha}
            </p>
          </div>
        </div>

        {/* Prioridad */}
        <div className="flex items-start gap-2">
          <Flag className="mt-0.5 h-4 w-4 text-amber-500" />

          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">
              Prioridad
            </p>

            {editando ? (
              <Select
                value={prioridad}
                onValueChange={(value) =>
                  onPrioridadChange(
                    value as PrioridadTrabajo,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>

                <SelectContent>
                  {PRIORIDADES_TRABAJO.map(
                    (item) => (
                      <SelectItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            ) : (
              <p className="font-medium">
                {prioridad ?? "-"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
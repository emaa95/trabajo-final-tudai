import { Wrench, CalendarDays, Gauge } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { TrabajoDetalle } from "@/types";

interface VehiculoHistorialServicesProps {
  trabajos: TrabajoDetalle[];
  onVerTrabajo?: (id: string) => void;
}

export function VehiculoHistorialServices({
  trabajos,
  onVerTrabajo,
}: VehiculoHistorialServicesProps) {
  const services = trabajos.filter(
    (trabajo) => trabajo.service
  );

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Este vehículo no tiene services registrados.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((trabajo) => {
        const service = trabajo.service;

        if (!service) return null;

        return (
          <Card
            key={service.id}
            className="hover:bg-muted/40 transition"
          >
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-4">

                <div className="rounded-lg bg-green-100 p-3 text-green-700">
                  <Wrench className="size-5" />
                </div>

                <div className="space-y-1">

                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      Service
                    </h3>

                    <Badge variant="outline">
                      {trabajo.estado}
                    </Badge>
                  </div>


                  <p className="text-sm text-muted-foreground">
                    OT #{trabajo.id.slice(0, 8)}
                  </p>


                  <div className="mt-2 flex flex-wrap gap-4 text-sm">

                    <span className="flex items-center gap-1">
                      <Gauge className="size-4" />
                      {service.kilometraje_actual
                        ? `${service.kilometraje_actual} km`
                        : "Sin km"}
                    </span>


                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-4" />
                      Próximo:
                      {" "}
                      {service.proxima_fecha_service
                        ? new Date(
                            service.proxima_fecha_service
                          ).toLocaleDateString("es-AR")
                        : "Sin fecha"}
                    </span>

                  </div>

                </div>

              </div>


              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onVerTrabajo?.(trabajo.id)
                }
              >
                Ver OT
              </Button>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
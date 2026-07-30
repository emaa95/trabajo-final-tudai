import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  DollarSign,
  Flag,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { TrabajoDetalle } from "@/types";


interface VehiculoHistorialOTProps {
  trabajos: TrabajoDetalle[];
}


export function VehiculoHistorialOT({
  trabajos,
}: VehiculoHistorialOTProps) {

  const navigate = useNavigate();


  if (trabajos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ClipboardList className="mb-3 size-12 text-slate-300" />

          <h3 className="font-semibold">
            Sin órdenes de trabajo
          </h3>

          <p className="text-sm text-muted-foreground">
            Este vehículo todavía no tiene trabajos registrados.
          </p>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="space-y-4">

      {trabajos.map((trabajo) => (

        <Card
          key={trabajo.id}
          className="transition hover:shadow-md"
        >

          <CardContent className="p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


              <div className="space-y-3">

                <div>
                  <h3 className="text-lg font-semibold">
                    Orden de trabajo #{trabajo.id.slice(0, 8)}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {trabajo.tipo}
                  </p>
                </div>


                <div className="grid gap-3 text-sm sm:grid-cols-2">


                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-slate-500" />

                    <span>
                      Ingreso:
                      {" "}
                      {new Intl.DateTimeFormat(
                        "es-AR"
                      ).format(
                        new Date(trabajo.fecha_ingreso)
                      )}
                    </span>
                  </div>



                  <div className="flex items-center gap-2">
                    <Flag className="size-4 text-slate-500" />

                    <span>
                      Estado:
                      {" "}
                      {trabajo.estado}
                    </span>
                  </div>



                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-slate-500" />

                    <span>
                      ${trabajo.precio_total.toLocaleString(
                        "es-AR"
                      )}
                    </span>
                  </div>


                  <div className="flex items-center gap-2">
                    <ClipboardList className="size-4 text-slate-500" />

                    <span>
                      {trabajo.trabajos_solicitados.length}
                      {" "}
                      tareas solicitadas
                    </span>
                  </div>


                </div>


                {trabajo.notas && (
                  <p className="text-sm text-muted-foreground">
                    {trabajo.notas}
                  </p>
                )}


              </div>



              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() =>
                  navigate(
                    `/trabajos/${trabajo.id}`
                  )
                }
              >

                Ver OT

                <ArrowRight className="ml-2 size-4" />

              </Button>


            </div>

          </CardContent>

        </Card>

      ))}

    </div>
  );
}
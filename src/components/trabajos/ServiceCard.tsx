import { useState } from "react";

import type {
  EstadoTrabajo,
  Service,
} from "@/types";

import {
  Calendar,
  Gauge,
  Package,
  Plus,
  Trash2,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { ModalRepuestoService } from "@/components/modals/ModalRepuestoService";

import { useServices } from "@/hooks/useServices";

import { sileo } from "sileo";

type ServiceCardProps = {
  service: Service | null;
  estadoTrabajo: EstadoTrabajo;
};


export function ServiceCard({
  service,
  estadoTrabajo,
}: ServiceCardProps) {

  const [showModalRepuesto, setShowModalRepuesto] =
    useState(false);


  const {
    getServiceByIdService,
    serviceSeleccionado,
    deleteRepuestoService,
  } = useServices();


  const serviceActual =
    serviceSeleccionado ?? service;


  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });


  const handleCloseModalRepuesto = async (
    actualizar = false
  ) => {

    setShowModalRepuesto(false);


    if (
      actualizar &&
      serviceActual
    ) {

      await getServiceByIdService(
        serviceActual.id
      );

    }

  };


  const handleDeleteRepuesto = async (
  repuestoId: string
) => {

  try {

    await deleteRepuestoService(
      repuestoId,
      estadoTrabajo
    );


    if (serviceActual) {

      await getServiceByIdService(
        serviceActual.id
      );

    }


    sileo.success({
      title: "Repuesto eliminado",
      description:
        "El repuesto fue eliminado correctamente.",
    });


  } catch (error) {

    console.error(
      "Error al eliminar repuesto:",
      error
    );


    sileo.error({
      title: "Error al eliminar repuesto",
      description:
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el repuesto.",
    });

  }

};


  const repuestos =
    serviceActual?.repuestos ?? [];


  return (
    <>

      <Card className="border-slate-200">

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Wrench className="text-blue-500" />

            Service

          </CardTitle>

        </CardHeader>


        <CardContent>

          {!serviceActual ? (

            <div className="py-6 text-center text-slate-400">

              <Wrench className="mx-auto mb-2 size-6" />

              <p className="text-sm">
                No hay service registrado
              </p>

            </div>

          ) : (

            <div className="space-y-6">


              <div className="grid grid-cols-2 gap-4">


                {serviceActual.kilometraje_actual !== null && (

                  <div className="flex items-center gap-2">

                    <Gauge className="size-4 text-slate-400" />

                    <div>

                      <p className="text-xs text-slate-500">
                        Kilometraje actual
                      </p>

                      <p className="font-medium">
                        {serviceActual.kilometraje_actual.toLocaleString(
                          "es-AR"
                        )} km
                      </p>

                    </div>

                  </div>

                )}


                {serviceActual.proximo_service_km && (

                  <div className="flex items-center gap-2">

                    <Gauge className="size-4 text-slate-400" />

                    <div>

                      <p className="text-xs text-slate-500">
                        Próximo service
                      </p>

                      <p className="font-medium">
                        {serviceActual.proximo_service_km.toLocaleString(
                          "es-AR"
                        )} km
                      </p>

                    </div>

                  </div>

                )}


                {serviceActual.proxima_fecha_service && (

                  <div className="flex items-center gap-2">

                    <Calendar className="size-4 text-slate-400" />

                    <div>

                      <p className="text-xs text-slate-500">
                        Próxima fecha
                      </p>

                      <p className="font-medium">
                        {formatFecha(
                          serviceActual.proxima_fecha_service
                        )}
                      </p>

                    </div>

                  </div>

                )}


                {serviceActual.observaciones && (

                  <div className="col-span-2">

                    <p className="text-xs text-slate-500 mb-1">
                      Observaciones
                    </p>

                    <p className="text-sm text-slate-700">
                      {serviceActual.observaciones}
                    </p>

                  </div>

                )}

              </div>


              <Separator />


              <div className="space-y-4">


                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Package className="size-4 text-slate-500" />

                    <h3 className="font-medium">
                      Repuestos utilizados
                    </h3>

                  </div>


                  <Button
                    size="sm"
                    onClick={() =>
                      setShowModalRepuesto(true)
                    }
                  >

                    <Plus className="mr-2 size-4" />

                    Agregar repuesto

                  </Button>

                </div>



                {repuestos.length > 0 ? (

                  <div className="space-y-2">

                    {repuestos.map((repuesto) => (

                      <div
                        key={repuesto.id}
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-md
                          border
                          p-3
                        "
                      >

                        <div>

                          <p className="font-medium">
                            {repuesto.descripcion}
                          </p>

                          <p className="text-sm text-slate-500">

                            {repuesto.cantidad}{" "}
                            {repuesto.unidad}

                          </p>

                        </div>


                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteRepuesto(
                              repuesto.id
                            )
                          }
                        >

                          <Trash2 className="size-4 text-red-500" />

                        </Button>


                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="
                    rounded-lg
                    border
                    border-dashed
                    py-6
                    text-center
                  ">

                    <Package className="mx-auto mb-2 size-5 text-slate-400" />

                    <p className="text-sm text-slate-500">
                      No hay repuestos registrados
                    </p>

                  </div>

                )}

              </div>


            </div>

          )}

        </CardContent>

      </Card>



      {serviceActual && (

        <ModalRepuestoService

          open={showModalRepuesto}

          serviceId={serviceActual.id}

          repuesto={null}

          onClose={handleCloseModalRepuesto}

        />

      )}

    </>
  );
}
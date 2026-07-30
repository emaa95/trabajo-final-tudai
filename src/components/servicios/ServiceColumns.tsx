import { Eye, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ServiceDetalle } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

interface CreateServiceColumnsProps {
  onVerDetalle?: (service: ServiceDetalle) => void;
}

export function createServiceColumns({
  onVerDetalle,
}: CreateServiceColumnsProps): DataTableColumn<ServiceDetalle>[] {
  return [
    {
      key: "vehiculo",
      header: "Vehículo",

      render: (service) => {
        const vehiculo = service.trabajo?.vehiculo;

        if (!vehiculo) {
          return (
            <span className="text-muted-foreground">
              Sin vehículo
            </span>
          );
        }

        return (
          <div>
            <p className="font-medium">
              {vehiculo.marca} {vehiculo.modelo}
            </p>

            <p className="text-sm text-muted-foreground">
              {vehiculo.patente}
            </p>
          </div>
        );
      },
    },

    {
      key: "cliente",
      header: "Cliente",

      render: (service) =>
        service.trabajo?.vehiculo?.cliente?.nombre ?? "-",
    },

    {
      key: "kilometraje",
      header: "Km actual",

      render: (service) =>
        `${service.kilometraje_actual.toLocaleString("es-AR")} km`,
    },

    {
      key: "proximo",
      header: "Próximo service",

      render: (service) =>
        service.proximo_service_km
          ? `${service.proximo_service_km.toLocaleString("es-AR")} km`
          : "-",
    },

    {
      key: "fecha",
      header: "Próxima fecha",

      render: (service) =>
        service.proxima_fecha_service
          ? new Intl.DateTimeFormat("es-AR").format(
              new Date(service.proxima_fecha_service)
            )
          : "-",
    },

    {
      key: "repuestos",
      header: "Repuestos",

      render: (service) => (
        <div className="flex items-center gap-2">
          <Wrench className="size-4 text-slate-500" />
          {service.repuestos?.length ?? 0}
        </div>
      ),
    },

    {
      key: "acciones",
      header: "Acciones",

      render: (service) => (
        <Button
          size="icon"
          variant="ghost"
          title="Ver orden de trabajo"
          onClick={() => onVerDetalle?.(service)}
          disabled={!service.trabajo}
        >
          <Eye className="size-4 text-slate-600" />
        </Button>
      ),
    },
  ];
}
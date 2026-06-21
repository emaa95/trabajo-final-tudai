import { Car, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Cliente } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

interface CreateClienteColumnsProps {
  vehiculosCount: Record<string, number>;

  onVerDetalle?: (cliente: Cliente) => void;
  onNuevoVehiculo?: (cliente: Cliente) => void;
}

export function createClienteColumns({
  vehiculosCount,
  onVerDetalle,
  onNuevoVehiculo,
}: CreateClienteColumnsProps): DataTableColumn<Cliente>[] {
  return [
    {
      key: "cliente",
      header: "Cliente",

      render: (cliente) => (
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
            {cliente.nombre
              .split(" ")
              .slice(0, 2)
              .map((p) => p[0])
              .join("")
              .toUpperCase()}
          </div>

          <span className="font-medium">
            {cliente.nombre}
          </span>
        </div>
      ),
    },

    {
      key: "telefono",
      header: "Teléfono",

      cellClassName: "text-muted-foreground",

      render: (cliente) => cliente.telefono || "—",
    },

    {
      key: "vehiculos",
      header: "Vehículos",

      render: (cliente) => (
        <div className="flex items-center justify-center gap-2">
          <Car className="h-4 w-4 text-blue-600" />

          <span>
            {vehiculosCount[cliente.id] ?? 0}
          </span>
        </div>
      ),
    },

    {
      key: "estado",
      header: "Estado",

      render: (cliente) => {
        const cantidadVehiculos = vehiculosCount[cliente.id] ?? 0;

        return cantidadVehiculos > 0 ? (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Activo
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            Sin vehículo
          </span>
        );
      },
    },

    {
      key: "acciones",
      header: "Acciones",

      render: (cliente) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onVerDetalle?.(cliente)}
          >
            Ver detalle
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => onNuevoVehiculo?.(cliente)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
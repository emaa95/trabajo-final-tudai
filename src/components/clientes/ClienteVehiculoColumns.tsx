import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Vehiculo } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

interface CreateClienteVehiculoColumnsProps {
  onEditar?: (vehiculo: Vehiculo) => void;
}

export function createClienteVehiculoColumns({
  onEditar,
}: CreateClienteVehiculoColumnsProps): DataTableColumn<Vehiculo>[] {
  return [
    {
      key: "patente",
      header: "Patente",

      render: (vehiculo) => (
        <span className="font-semibold tracking-wide">
          {vehiculo.patente}
        </span>
      ),
    },

    {
      key: "modelo",
      header: "Modelo",

      render: (vehiculo) => (
        <span>{vehiculo.modelo ?? "—"}</span>
      ),
    },

    {
      key: "marca",
      header: "Marca",

      render: (vehiculo) => (
        <span>{vehiculo.marca ?? "—"}</span>
      ),
    },

    {
      key: "anio",
      header: "Año",

      render: (vehiculo) => (
        <span>{vehiculo.anio ?? "—"}</span>
      ),
    },

    {
      key: "acciones",
      header: "Acciones",

      render: (vehiculo) => (
        <div className="flex justify-center">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEditar?.(vehiculo)}
            aria-label="Editar vehículo"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
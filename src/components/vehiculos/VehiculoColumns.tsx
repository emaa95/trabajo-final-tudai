import { User } from "lucide-react";

import type { Vehiculo } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

interface CreateVehiculoColumnsProps {
  clientesMap: Record<string, string>;
  onVerDetalle?: (vehiculo: Vehiculo) => void;
}

export function createVehiculoColumns({
  clientesMap,
  onVerDetalle,
}: CreateVehiculoColumnsProps): DataTableColumn<Vehiculo>[] {
  return [
    {
      key: "patente",
      header: "Patente",

      render: (vehiculo) => (
        <div className="font-bold text-lg tracking-wide">
          {vehiculo.patente}
        </div>
      ),
    },

    {
      key: "marca",
      header: "Marca",
      render: (vehiculo) => vehiculo.marca || "-",
    },

    {
      key: "modelo",
      header: "Modelo",
      render: (vehiculo) => vehiculo.modelo || "-",
    },

    {
      key: "anio",
      header: "Año",
      render: (vehiculo) => vehiculo.anio || "-",
    },

    {
      key: "cliente",
      header: "Cliente",

      render: (vehiculo) => (
        <div className="flex items-center justify-center gap-2">
          <User className="size-4 text-slate-500" />
          {clientesMap[vehiculo.cliente_id] ?? "Sin cliente"}
        </div>
      ),
    },

    {
      key: "acciones",
      header: "Acciones",

      render: (vehiculo) => (
        <div className="flex justify-end">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => onVerDetalle?.(vehiculo)}
          >
            Ver detalles
          </button>
        </div>
      ),
    },
  ];
}
import { User, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Vehiculo } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

interface CreateVehiculoColumnsProps {
  clientesMap: Record<string, string>;
  onVerDetalle?: (vehiculo: Vehiculo) => void;
  onEditar?: (vehiculo: Vehiculo) => void;
  onEliminar?: (vehiculo: Vehiculo) => void;
}

export function createVehiculoColumns({
  clientesMap,
  onVerDetalle,
  onEditar,
  onEliminar,
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
        <div className="flex items-center justify-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            title="Ver detalles"
            onClick={() => onVerDetalle?.(vehiculo)}
          >
            <Eye className="size-4 text-slate-600" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="Editar vehículo"
            onClick={() => onEditar?.(vehiculo)}
          >
            <Pencil className="size-4 text-slate-600" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="Eliminar vehículo"
            onClick={() => onEliminar?.(vehiculo)}
          >
            <Trash2 className="size-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];
}
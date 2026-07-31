import { User, Eye, Plus, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Cliente } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

interface CreateClienteColumnsProps {
  vehiculosCount: Record<string, number>;

  onVerDetalle?: (cliente: Cliente) => void;
  onEditar?: (cliente: Cliente) => void;
  onNuevoVehiculo?: (cliente: Cliente) => void;
}

export function createClienteColumns({
  vehiculosCount,
  onVerDetalle,
  onEditar,
  onNuevoVehiculo,
}: CreateClienteColumnsProps): DataTableColumn<Cliente>[] {
  return [
    {
      key: "nombre",
      header: "Nombre",

      render: (cliente) => (
        <div className="flex items-center justify-center gap-2">
          <User className="size-4 text-slate-500" />

          <span className="font-medium">
            {cliente.nombre}
          </span>
        </div>
      ),
    },

    {
      key: "apellido",
      header: "Apellido",

      render: (cliente) =>
        cliente.apellido || "-",
    },

    {
      key: "documento",
      header: "Documento",

      render: (cliente) => (
        <span>
          {cliente.tipo_documento ?? "-"}{" "}
          {cliente.documento ?? "-"}
        </span>
      ),
    },

    {
      key: "telefono",
      header: "Teléfono",

      cellClassName: "text-muted-foreground",

      render: (cliente) =>
        cliente.telefono || "-",
    },

    {
      key: "vehiculos",
      header: "Vehículos",

      render: (cliente) => (
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium">
            {vehiculosCount[cliente.id] ?? 0}
          </span>

          <span className="text-xs text-muted-foreground">
            unidades
          </span>
        </div>
      ),
    },

    {
      key: "estado",
      header: "Estado",

      render: (cliente) => {
        const cantidadVehiculos =
          vehiculosCount[cliente.id] ?? 0;

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
        <div className="flex items-center justify-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            title="Ver detalles"
            onClick={() =>
              onVerDetalle?.(cliente)
            }
          >
            <Eye className="size-4 text-slate-600" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="Editar cliente"
            onClick={() =>
              onEditar?.(cliente)
            }
          >
            <Pencil className="size-4 text-slate-600" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="Nuevo vehículo"
            onClick={() =>
              onNuevoVehiculo?.(cliente)
            }
          >
            <Plus className="size-4 text-blue-600" />
          </Button>
        </div>
      ),
    },
  ];
}
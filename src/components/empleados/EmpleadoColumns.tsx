import {
  Pencil,
  UserCheck,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Empleado } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

interface CreateEmpleadoColumnsProps {
  onEditar: (empleado: Empleado) => void;
  onToggleActivo: (empleado: Empleado) => void;
}

export function createEmpleadoColumns({
  onEditar,
  onToggleActivo,
}: CreateEmpleadoColumnsProps): DataTableColumn<Empleado>[] {
  return [
    {
      key: "empleado",
      header: "Empleado",

      render: (empleado) => (
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
            {`${empleado.nombre[0]}${empleado.apellido[0]}`.toUpperCase()}
          </div>

          <span className="font-medium">
            {empleado.nombre} {empleado.apellido}
          </span>
        </div>
      ),
    },

    {
      key: "dni",
      header: "DNI",

      render: (empleado) => empleado.dni,
    },

    {
      key: "contacto",
      header: "Contacto",

      cellClassName: "text-muted-foreground",

      render: (empleado) => empleado.telefono,
    },

    {
      key: "cargo",
      header: "Cargo",

      render: (empleado) => (
        <span className="font-medium">
          {empleado.cargo}
        </span>
      ),
    },

    {
      key: "fecha",
      header: "Ingreso",

      render: (empleado) =>
        new Date(empleado.fecha_ingreso).toLocaleDateString("es-AR"),
    },

    {
      key: "estado",
      header: "Estado",

      render: (empleado) =>
        empleado.activo ? (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Activo
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Inactivo
          </span>
        ),
    },

    {
      key: "acciones",
      header: "Acciones",

      render: (empleado) => (
        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEditar(empleado)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => onToggleActivo(empleado)}
          >
            {empleado.activo ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];
}
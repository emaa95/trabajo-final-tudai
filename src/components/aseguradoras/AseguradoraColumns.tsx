import {
  Shield,
  Eye,
  Pencil,
  Power,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Aseguradora } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";


interface CreateAseguradoraColumnsProps {
  onVerDetalle?: (
    aseguradora: Aseguradora
  ) => void;

  onEditar?: (
    aseguradora: Aseguradora
  ) => void;

  onCambiarEstado?: (
    aseguradora: Aseguradora
  ) => void;
}


export function createAseguradoraColumns({
  onVerDetalle,
  onEditar,
  onCambiarEstado,
}: CreateAseguradoraColumnsProps = {}): DataTableColumn<Aseguradora>[] {

  return [

    {
      key: "aseguradora",
      header: "Aseguradora",

      render: (aseguradora) => (
        <div className="flex items-center justify-center gap-2">

          <Shield className="size-4 text-blue-600" />

          <span className="font-medium">
            {aseguradora.nombre}
          </span>

        </div>
      ),
    },


    {
      key: "cuit",
      header: "CUIT",

      cellClassName:
        "text-muted-foreground",

      render: (aseguradora) =>
        aseguradora.cuit || "-",
    },


    {
      key: "contacto",
      header: "Contacto",

      render: (aseguradora) => (
        <div className="text-sm text-muted-foreground">

          {
            aseguradora.telefono && (
              <div>
                {aseguradora.telefono}
              </div>
            )
          }


          {
            aseguradora.email && (
              <div>
                {aseguradora.email}
              </div>
            )
          }


          {
            !aseguradora.telefono &&
            !aseguradora.email &&
            "-"
          }

        </div>
      ),
    },


    {
      key: "estado",
      header: "Estado",

      render: (aseguradora) =>
        aseguradora.activa ? (

          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Activa
          </span>

        ) : (

          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Inactiva
          </span>

        ),
    },


    {
      key: "direccion",
      header: "Dirección",

      cellClassName:
        "text-muted-foreground",

      render: (aseguradora) =>
        aseguradora.direccion || "-",
    },


    {
      key: "acciones",
      header: "Acciones",

      render: (aseguradora) => (

        <div className="flex items-center justify-center gap-1">

          <Button
            size="icon"
            variant="ghost"
            title="Ver detalle"
            onClick={() =>
              onVerDetalle?.(aseguradora)
            }
          >
            <Eye className="size-4 text-slate-600" />
          </Button>


          <Button
            size="icon"
            variant="ghost"
            title="Editar"
            onClick={() =>
              onEditar?.(aseguradora)
            }
          >
            <Pencil className="size-4 text-blue-600" />
          </Button>


          <Button
            size="icon"
            variant="ghost"
            title="Cambiar estado"
            onClick={() =>
              onCambiarEstado?.(aseguradora)
            }
          >
            <Power className="size-4 text-amber-600" />
          </Button>

        </div>

      ),
    },

  ];
}
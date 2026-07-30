import type { Vehiculo } from "@/types";
import type { DataTableColumn } from "@/components/common/DataTable";

import { DataTable } from "@/components/common/DataTable";
import { Car } from "lucide-react";

interface ClienteVehiculosTableProps {
  vehiculos: Vehiculo[];
  columns: DataTableColumn<Vehiculo>[];
  loading?: boolean;
}

export function ClienteVehiculosTable({
  vehiculos,
  columns,
  loading = false,
}: ClienteVehiculosTableProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          Vehículos
        </h2>

        <p className="text-sm text-muted-foreground">
          Vehículos registrados del cliente.
        </p>
      </div>

      <DataTable
        data={vehiculos}
        columns={columns}
        getRowKey={(vehiculo) => vehiculo.id}
        loading={loading}
        headerColorClass="text-primary"
        emptyTitle="Sin vehículos"
        emptyDescription="Este cliente todavía no tiene vehículos registrados."
        emptyIcon={<Car className="size-14 text-slate-300" />}
      />
    </div>
  );
}
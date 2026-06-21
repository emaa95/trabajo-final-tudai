import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useVehiculos } from "@/hooks/useVehiculos";
import { useClientes } from "@/hooks/useClientes";

import { ModalVehiculo } from "@/components/modals/ModalVehiculo";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";

import { createVehiculoColumns } from "@/components/vehiculos/VehiculoColumns";

import type { Vehiculo } from "@/types";

export function Vehiculos() {
  const {
    vehiculos,
    loading,
    fetchVehiculos,
    addVehiculo,
  } = useVehiculos();

  const {
    clientes,
    fetchClientes,
  } = useClientes();

  const [open, setOpen] = useState(false);

  // ─────────────────────────────
  // Load data (estable, sin dependencias)
  // ─────────────────────────────
  useEffect(() => {
    let alive = true;

    const load = async () => {
      await Promise.all([
        fetchVehiculos(),
        fetchClientes(),
      ]);

      if (!alive) return;
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  // ─────────────────────────────
  // Map cliente_id → nombre
  // ─────────────────────────────
  const clientesMap = useMemo(() => {
    return clientes.reduce((acc, c) => {
      acc[c.id] = c.nombre;
      return acc;
    }, {} as Record<string, string>);
  }, [clientes]);

  // ─────────────────────────────
  // Columns (memo correcto)
  // ─────────────────────────────
  const columns = useMemo(
    () =>
      createVehiculoColumns({
        clientesMap,
        onVerDetalle: (vehiculo: Vehiculo) => {
          console.log("Ver detalle:", vehiculo);
        },
      }),
    [clientesMap],
  );

  // ─────────────────────────────
  // Create handler (sin refetch innecesario)
  // ─────────────────────────────
  const handleCreate = async (dto: any) => {
    await addVehiculo(dto);

    // ❌ antes: refetch innecesario
    // await fetchVehiculos();

    setOpen(false);
  };

  // ─────────────────────────────
  // Loading derivado seguro
  // ─────────────────────────────
  const isLoading = loading && vehiculos.length === 0;

  // ─────────────────────────────
  // Render
  // ─────────────────────────────
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader
        title="Vehículos"
        description={`Gestión de vehículos del taller (${vehiculos.length} registrados)`}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 size-4" />
            Nuevo Vehículo
          </Button>
        }
      />

      {/* MODAL */}
      <ModalVehiculo
        open={open}
        clientes={clientes}
        onClose={() => setOpen(false)}
        onCreated={handleCreate}
      />

      {/* TABLE */}
      <DataTable
        data={vehiculos}
        columns={columns}
        getRowKey={(v) => v.id}
        loading={isLoading}
        headerColorClass="text-blue-600"
        emptyTitle="No hay vehículos registrados"
        emptyDescription="Creá el primer vehículo del sistema."
      />
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car, Users, UserX } from "lucide-react";

import { useClientes } from "@/hooks/useClientes";
import { ModalCliente } from "@/components/modals/ModalCliente";
import { useVehiculos } from "@/hooks/useVehiculos";

import { DataFilters } from "@/components/common/DataFilters";
import { useDataFilters } from "@/hooks/useDataFilters";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/StatsGrid";
import { DataTable } from "@/components/common/DataTable";
import { createClienteColumns } from "@/components/clientes/ClienteColumns";

const SORT_OPTIONS = [
  { value: "nombre", label: "Nombre A–Z" },
  { value: "vehiculos", label: "Más vehículos" },
  { value: "reciente", label: "Más reciente" },
];

const FILTER_GROUPS = [
  {
    id: "estado",
    options: [
      { value: "todos", label: "Todos" },
      { value: "con-vehiculo", label: "Con vehículo" },
      { value: "sin-vehiculo", label: "Sin vehículo" },
    ],
  },
];

export function Clientes() {
  // ── Store hooks ─────────────────────────────
  const { clientes, error, fetchClientes } = useClientes();
  const { vehiculos, fetchVehiculos } = useVehiculos();

  const [openClienteModal, setOpenClienteModal] = useState(false);

  const { search, sortBy, activeFilters, filterProps } = useDataFilters({
    defaultSort: "nombre",
    defaultFilters: { estado: "todos" },
  });

  // ── Load data (sin estado local de loading) ──
  useEffect(() => {
    let alive = true;

    const load = async () => {
      await Promise.all([fetchClientes(), fetchVehiculos()]);

      if (!alive) return;
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  // ── Vehículos por cliente ────────────────────
  const vehiculosCount = useMemo(() => {
    return vehiculos.reduce((acc, vehiculo) => {
      if (!vehiculo.cliente_id) return acc;
      acc[vehiculo.cliente_id] =
        (acc[vehiculo.cliente_id] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [vehiculos]);

  // ── Columns ──────────────────────────────────
  const columns = useMemo(
    () =>
      createClienteColumns({
        vehiculosCount,
        onVerDetalle: (cliente) => {
          console.log(cliente);
        },
        onNuevoVehiculo: (cliente) => {
          console.log("nuevo vehiculo", cliente.id);
        },
      }),
    [vehiculosCount],
  );

  // ── Stats ────────────────────────────────────
  const totalVehiculos = vehiculos.length;

  const sinVehiculo = useMemo(
    () => clientes.filter((c) => !vehiculosCount[c.id]).length,
    [clientes, vehiculosCount],
  );

  const clientesEsteMes = useMemo(() => {
    const now = new Date();
    return clientes.filter((cliente) => {
      const fecha = new Date(cliente.created_at);
      return (
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [clientes]);

  const vehiculosEsteMes = useMemo(() => {
    const now = new Date();
    return vehiculos.filter((vehiculo) => {
      const fecha = new Date(vehiculo.created_at);
      return (
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [vehiculos]);

  // ── Filtering ────────────────────────────────
  const filteredClientes = useMemo(() => {
    const q = search.toLowerCase();
    const estadoFilter = activeFilters.estado ?? "todos";

    let result = clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        (c.telefono ?? "").toLowerCase().includes(q),
    );

    if (estadoFilter === "con-vehiculo") {
      result = result.filter(
        (c) => (vehiculosCount[c.id] ?? 0) > 0,
      );
    } else if (estadoFilter === "sin-vehiculo") {
      result = result.filter(
        (c) => !vehiculosCount[c.id],
      );
    }

    if (sortBy === "nombre") {
      result = [...result].sort((a, b) =>
        a.nombre.localeCompare(b.nombre),
      );
    } else if (sortBy === "vehiculos") {
      result = [...result].sort(
        (a, b) =>
          (vehiculosCount[b.id] ?? 0) -
          (vehiculosCount[a.id] ?? 0),
      );
    } else if (sortBy === "reciente") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );
    }

    return result;
  }, [clientes, search, sortBy, activeFilters, vehiculosCount]);

  // ── Loading derivado REAL ────────────────────
  const loading =
    clientes.length === 0 && vehiculos.length === 0;

  // ── Error guard ──────────────────────────────
  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ── Loading UI ───────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">
          Cargando clientes...
        </p>
      </div>
    );
  }

  // ── Render ───────────────────────────────────
  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Clientes"
          description="Gestión de clientes del taller"
          actions={
            <Button onClick={() => setOpenClienteModal(true)}>
              <Plus className="mr-2 size-4" />
              Nuevo Cliente
            </Button>
          }
        />

        <StatsGrid>
          <StatCard
            icon={<Users className="size-5" />}
            iconClass="theme-cliente bg-primary/10 text-primary"
            label="Clientes"
            value={clientes.length}
            footer={`+${clientesEsteMes} este mes`}
          />

          <StatCard
            icon={<Car className="size-5" />}
            iconClass="bg-blue-100 text-blue-700"
            label="Vehículos"
            value={totalVehiculos}
            footer={`+${vehiculosEsteMes} este mes`}
          />

          <StatCard
            icon={<UserX className="size-5" />}
            iconClass="bg-amber-100 text-amber-700"
            label="Sin vehículo"
            value={sinVehiculo}
            footer={`${Math.round(
              clientes.length > 0
                ? (sinVehiculo / clientes.length) * 100
                : 0,
            )}% del total`}
            trend="neutral"
          />
        </StatsGrid>

        <DataFilters
          {...filterProps}
          searchPlaceholder="Buscar por nombre o teléfono…"
          sortOptions={SORT_OPTIONS}
          filterGroups={FILTER_GROUPS}
        />

        {filteredClientes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 size-14 text-slate-300" />
              <h3 className="text-lg font-semibold">
                No se encontraron clientes
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Intentá con otra búsqueda o creá un nuevo cliente.
              </p>
            </CardContent>
          </Card>
        )}

        <DataTable
          data={filteredClientes}
          columns={columns}
          getRowKey={(cliente) => cliente.id}
          loading={loading}
          headerColorClass="theme-cliente text-primary"
          emptyTitle="No se encontraron clientes"
          emptyDescription="Intentá con otra búsqueda o creá un nuevo cliente."
          emptyIcon={<Users className="size-14 text-slate-300" />}
        />
      </div>

      <ModalCliente
        open={openClienteModal}
        onClose={() => setOpenClienteModal(false)}
        onCreated={() => {
          fetchClientes();
          setOpenClienteModal(false);
        }}
      />
    </>
  );
}
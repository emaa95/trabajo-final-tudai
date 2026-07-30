import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import { sileo } from "sileo";

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
  const navigate = useNavigate();

  const {
    clientes,
    error,
    loading: loadingClientes,
    fetchClientes,
  } = useClientes();

  const {
    vehiculos,
    error: errorVehiculos,
    loading: loadingVehiculos,
    fetchVehiculos,
  } = useVehiculos();

  const [openClienteModal, setOpenClienteModal] =
    useState(false);

  const {
    search,
    sortBy,
    activeFilters,
    filterProps,
  } = useDataFilters({
    defaultSort: "nombre",
    defaultFilters: { estado: "todos" },
  });

  useEffect(() => {
    fetchClientes();
    fetchVehiculos();
  }, [fetchClientes, fetchVehiculos]);

  useEffect(() => {
    if (error) {
      sileo.error({
        title: "Error al cargar clientes",
        description: error,
      });
    }

    if (errorVehiculos) {
      sileo.error({
        title: "Error al cargar vehículos",
        description: errorVehiculos,
      });
    }
  }, [error, errorVehiculos]);

  const loading =
    loadingClientes ||
    loadingVehiculos;

  const vehiculosCount = useMemo(() => {
    return vehiculos.reduce(
      (acc, vehiculo) => {
        if (!vehiculo.cliente_id) return acc;

        acc[vehiculo.cliente_id] =
          (acc[vehiculo.cliente_id] ?? 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );
  }, [vehiculos]);

  const columns = useMemo(
    () =>
      createClienteColumns({
        vehiculosCount,

        onVerDetalle: (cliente) => {
          navigate(`/clientes/${cliente.id}`);
        },

        onNuevoVehiculo: (cliente) => {
          console.log(
            "nuevo vehiculo",
            cliente.id,
          );
        },
      }),
    [navigate, vehiculosCount],
  );

  const totalVehiculos = vehiculos.length;

  const sinVehiculo = useMemo(
    () =>
      clientes.filter(
        (c) => !vehiculosCount[c.id],
      ).length,
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

  const filteredClientes = useMemo(() => {
    const q = search.toLowerCase();

    const estadoFilter =
      activeFilters.estado ?? "todos";

    let result = clientes.filter(
      (cliente) =>
        cliente.nombre
          .toLowerCase()
          .includes(q) ||
        (cliente.telefono ?? "")
          .toLowerCase()
          .includes(q),
    );

    if (estadoFilter === "con-vehiculo") {
      result = result.filter(
        (cliente) =>
          (vehiculosCount[cliente.id] ?? 0) > 0,
      );
    }

    if (estadoFilter === "sin-vehiculo") {
      result = result.filter(
        (cliente) =>
          !vehiculosCount[cliente.id],
      );
    }

    if (sortBy === "nombre") {
      result.sort((a, b) =>
        a.nombre.localeCompare(b.nombre),
      );
    }

    if (sortBy === "vehiculos") {
      result.sort(
        (a, b) =>
          (vehiculosCount[b.id] ?? 0) -
          (vehiculosCount[a.id] ?? 0),
      );
    }

    if (sortBy === "reciente") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );
    }

    return result;
  }, [
    clientes,
    search,
    sortBy,
    activeFilters,
    vehiculosCount,
  ]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">
          Cargando clientes...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Clientes"
          description="Gestión de clientes del taller"
          actions={
            <Button
              onClick={() =>
                setOpenClienteModal(true)
              }
            >
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
              clientes.length
                ? (sinVehiculo /
                    clientes.length) *
                    100
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

        <DataTable
          data={filteredClientes}
          columns={columns}
          getRowKey={(cliente) =>
            cliente.id
          }
          loading={loading}
          headerColorClass="theme-cliente text-primary"
          emptyTitle="No se encontraron clientes"
          emptyDescription="Intentá con otra búsqueda o creá un nuevo cliente."
          emptyIcon={
            <Users className="size-14 text-slate-300" />
          }
        />
      </div>

      <ModalCliente
        open={openClienteModal}
        onClose={() =>
          setOpenClienteModal(false)
        }
        onCreated={async () => {
          await fetchClientes();

          sileo.success({
            title: "Cliente creado",
            description:
              "El cliente fue registrado correctamente.",
          });

          setOpenClienteModal(false);
        }}
      />
    </>
  );
}



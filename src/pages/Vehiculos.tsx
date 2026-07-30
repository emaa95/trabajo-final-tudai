import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Plus, Car, Users, AlertTriangle } from "lucide-react";

import { useVehiculos } from "@/hooks/useVehiculos";
import { useClientes } from "@/hooks/useClientes";
import { ModalVehiculo } from "@/components/modals/ModalVehiculo";

import { DataFilters } from "@/components/common/DataFilters";
import { useDataFilters } from "@/hooks/useDataFilters";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/StatsGrid";
import { DataTable } from "@/components/common/DataTable";

import { createVehiculoColumns } from "@/components/vehiculos/VehiculoColumns";

import type { Vehiculo } from "@/types";

import { sileo } from "sileo";

const SORT_OPTIONS = [
  { value: "patente", label: "Patente A–Z" },
  { value: "marca", label: "Marca A–Z" },
  { value: "reciente", label: "Más reciente" },
];

const FILTER_GROUPS = [
  {
    id: "estado",
    options: [
      { value: "todos", label: "Todos" },
      { value: "completos", label: "Datos completos" },
      { value: "incompletos", label: "Datos incompletos" },
    ],
  },
];

export function Vehiculos() {
  const navigate = useNavigate();

  const {
    vehiculos,
    error,
    loading: loadingVehiculos,
    fetchVehiculos,
    addVehiculo,
    editVehiculo,
    removeVehiculo,
  } = useVehiculos();

  const {
    clientes,
    loading: loadingClientes,
    fetchClientes,
  } = useClientes();

  const [openVehiculoModal, setOpenVehiculoModal] = useState(false);

  const [vehiculoAEditar, setVehiculoAEditar] =
    useState<Vehiculo | null>(null);

  const {
    search,
    sortBy,
    activeFilters,
    filterProps,
  } = useDataFilters({
    defaultSort: "patente",
    defaultFilters: { estado: "todos" },
  });

  useEffect(() => {
    fetchVehiculos();
    fetchClientes();
  }, [fetchVehiculos, fetchClientes]);

  const clientesMap = useMemo(() => {
    return clientes.reduce(
      (acc, c) => {
        acc[c.id] = c.nombre;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [clientes]);

  const columns = useMemo(
    () =>
      createVehiculoColumns({
        clientesMap,

        onVerDetalle: (vehiculo: Vehiculo) => {
          navigate(`/vehiculos/${vehiculo.id}`);
        },

        onEditar: (vehiculo: Vehiculo) => {
          setVehiculoAEditar(vehiculo);
        },

        onEliminar: (vehiculo: Vehiculo) => {
          sileo.action({
            title: "Eliminar vehículo",
            description: `¿Eliminar el vehículo ${vehiculo.patente}? Esta acción no se puede deshacer.`,
            button: {
              title: "Eliminar",
              onClick: async () => {
                try {
                  await removeVehiculo(vehiculo.id);

                  sileo.success({
                    title: "Vehículo eliminado",
                    description: `El vehículo ${vehiculo.patente} fue eliminado correctamente.`,
                  });
                } catch (error) {
                  console.error(error);

                  sileo.error({
                    title: "Error",
                    description:
                      "No se pudo eliminar el vehículo.",
                  });
                }
              },
            },
          });
        },
      }),
    [navigate, clientesMap, removeVehiculo],
  );

  const totalVehiculos = vehiculos.length;

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

  const clientesConVehiculo = useMemo(() => {
    const ids = new Set(
      vehiculos
        .filter((v) => v.cliente_id)
        .map((v) => v.cliente_id),
    );

    return ids.size;
  }, [vehiculos]);

  const vehiculosIncompletos = useMemo(
    () =>
      vehiculos.filter(
        (v) =>
          !v.marca ||
          !v.modelo ||
          !v.anio,
      ).length,
    [vehiculos],
  );

  const isIncompleto = (v: Vehiculo) =>
    !v.marca ||
    !v.modelo ||
    !v.anio;

  const filteredVehiculos = useMemo(() => {
    const q = search.toLowerCase();

    const estadoFilter =
      activeFilters.estado ?? "todos";

    let result = vehiculos.filter(
      (v) =>
        v.patente.toLowerCase().includes(q) ||
        (v.marca ?? "")
          .toLowerCase()
          .includes(q) ||
        (v.modelo ?? "")
          .toLowerCase()
          .includes(q),
    );

    if (estadoFilter === "completos") {
      result = result.filter(
        (v) => !isIncompleto(v),
      );
    }

    if (estadoFilter === "incompletos") {
      result = result.filter(
        (v) => isIncompleto(v),
      );
    }

    if (sortBy === "patente") {
      result = [...result].sort((a, b) =>
        a.patente.localeCompare(b.patente),
      );
    }

    if (sortBy === "marca") {
      result = [...result].sort((a, b) =>
        (a.marca ?? "").localeCompare(
          b.marca ?? "",
        ),
      );
    }

    if (sortBy === "reciente") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );
    }

    return result;
  }, [
    vehiculos,
    search,
    sortBy,
    activeFilters,
  ]);

  const loading =
    loadingVehiculos ||
    loadingClientes;

  const handleCreate = async (dto: any) => {
    try {
      await addVehiculo(dto);

      sileo.success({
        title: "Vehículo creado",
        description:
          "El vehículo fue registrado correctamente.",
      });

      setOpenVehiculoModal(false);
    } catch (error) {
      console.error(error);

      sileo.error({
        title: "Error",
        description:
          "No se pudo registrar el vehículo.",
      });
    }
  };

  const handleUpdate = async (
    id: string,
    dto: any,
  ) => {
    try {
      await editVehiculo(id, dto);

      sileo.success({
        title: "Vehículo actualizado",
        description:
          "Los datos fueron modificados correctamente.",
      });

      setVehiculoAEditar(null);
    } catch (error) {
      console.error(error);

      sileo.error({
        title: "Error",
        description:
          "No se pudo actualizar el vehículo.",
      });
    }
  };

  const handleCloseModal = () => {
    setOpenVehiculoModal(false);
    setVehiculoAEditar(null);
  };

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">
          Cargando vehículos...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Vehículos"
          description="Gestión de vehículos del taller"
          actions={
            <Button
              onClick={() =>
                setOpenVehiculoModal(true)
              }
            >
              <Plus className="mr-2 size-4" />
              Nuevo Vehículo
            </Button>
          }
        />

        <StatsGrid>
          <StatCard
            icon={<Car className="size-5" />}
            iconClass="bg-blue-100 text-blue-700"
            label="Vehículos"
            value={totalVehiculos}
            footer={`+${vehiculosEsteMes} este mes`}
          />

          <StatCard
            icon={<Users className="size-5" />}
            iconClass="theme-cliente bg-primary/10 text-primary"
            label="Clientes con vehículo"
            value={clientesConVehiculo}
            footer={`${Math.round(
              clientes.length > 0
                ? (clientesConVehiculo /
                    clientes.length) *
                  100
                : 0,
            )}% del total`}
          />

          <StatCard
            icon={
              <AlertTriangle className="size-5" />
            }
            iconClass="bg-amber-100 text-amber-700"
            label="Datos incompletos"
            value={vehiculosIncompletos}
            footer={`${Math.round(
              totalVehiculos > 0
                ? (vehiculosIncompletos /
                    totalVehiculos) *
                  100
                : 0,
            )}% del total`}
            trend="neutral"
          />
        </StatsGrid>

        <DataFilters
          {...filterProps}
          searchPlaceholder="Buscar por patente, marca o modelo…"
          sortOptions={SORT_OPTIONS}
          filterGroups={FILTER_GROUPS}
        />

        <DataTable
          data={filteredVehiculos}
          columns={columns}
          getRowKey={(vehiculo) =>
            vehiculo.id
          }
          loading={loading}
          headerColorClass="text-blue-600"
          emptyTitle="No se encontraron vehículos"
          emptyDescription="Intentá con otra búsqueda o creá un nuevo vehículo."
          emptyIcon={
            <Car className="size-14 text-slate-300" />
          }
        />
      </div>

      <ModalVehiculo
        open={
          openVehiculoModal ||
          !!vehiculoAEditar
        }
        clientes={clientes}
        vehiculo={vehiculoAEditar}
        onClose={handleCloseModal}
        onCreated={handleCreate}
        onUpdated={handleUpdate}
      />
    </>
  );
}


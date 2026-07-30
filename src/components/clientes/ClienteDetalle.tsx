import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Car, CalendarDays, CarFront } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useClientes } from "@/hooks/useClientes";
import { useVehiculos } from "@/hooks/useVehiculos";

import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/StatsGrid";
import { StatCard } from "@/components/common/StatCard";

import { ClienteProfileCard } from "@/components/clientes/ClienteProfileCard";
import { ClienteVehiculosTable } from "@/components/clientes/ClienteVehiculosTable";

import { createClienteVehiculoColumns } from "@/components/clientes/ClienteVehiculoColumns";

export function ClienteDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    clienteSeleccionado,
    loading: clienteLoading,
    error,
    fetchClienteById,
    clearClienteSeleccionado,
  } = useClientes();

  const {
    vehiculosByCliente,
    loading: vehiculosLoading,
    fetchVehiculosByCliente,
    clearVehiculosByCliente,
  } = useVehiculos();

  useEffect(() => {
    if (!id) return;

    fetchClienteById(id);
    fetchVehiculosByCliente(id);

    return () => {
      clearClienteSeleccionado();
      clearVehiculosByCliente();
    };
  }, [
    id,
    fetchClienteById,
    fetchVehiculosByCliente,
    clearClienteSeleccionado,
    clearVehiculosByCliente,
  ]);

  const columns = useMemo(
    () =>
      createClienteVehiculoColumns({
        onEditar: (vehiculo) => {
          console.log("Editar vehículo", vehiculo);
        },
      }),
    [],
  );

  const clienteDesde = useMemo(() => {
    if (!clienteSeleccionado) return "—";

    return new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(new Date(clienteSeleccionado.created_at));
  }, [clienteSeleccionado]);

  const ultimoVehiculo = useMemo(() => {
    if (vehiculosByCliente.length === 0) return "—";

    return [...vehiculosByCliente].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    )[0].patente;
  }, [vehiculosByCliente]);

  if (clienteLoading || vehiculosLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">
          Cargando cliente...
        </p>
      </div>
    );
  }

  if (error || !clienteSeleccionado) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">
          {error ?? "Cliente no encontrado"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit px-0"
        onClick={() => navigate("/clientes")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Volver
      </Button>

      <PageHeader
        title={`${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`}
        description={`Cliente desde ${clienteDesde}`}
      />

      <StatsGrid>
        <StatCard
          icon={<Car className="size-5" />}
          iconClass="bg-blue-100 text-blue-700"
          label="Vehículos"
          value={vehiculosByCliente.length}
        />

        <StatCard
          icon={<CalendarDays className="size-5" />}
          iconClass="bg-green-100 text-green-700"
          label="Alta"
          value={clienteDesde}
        />

        <StatCard
          icon={<CarFront className="size-5" />}
          iconClass="bg-violet-100 text-violet-700"
          label="Último vehículo"
          value={ultimoVehiculo}
        />
      </StatsGrid>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <ClienteProfileCard
          cliente={clienteSeleccionado}
          onNuevoVehiculo={() => {
            console.log("Nuevo vehículo");
          }}
        />

        <ClienteVehiculosTable
          vehiculos={vehiculosByCliente}
          columns={columns}
          loading={vehiculosLoading}
        />
      </div>
    </div>
  );
}
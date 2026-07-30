import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Car, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useVehiculos } from "@/hooks/useVehiculos";
import { useTrabajos } from "@/hooks/useTrabajos";

import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/StatsGrid";
import { StatCard } from "@/components/common/StatCard";

import { VehiculoHistorialOT } from "@/components/vehiculos/VehiculoHistorialOT";
import { VehiculoHistorialServices } from "@/components/vehiculos/VehiculoHistorialServices";

export function VehiculoDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    vehiculoSeleccionado,
    loading: vehiculoLoading,
    error: vehiculoError,
    fetchVehiculoById,
    clearVehiculoSeleccionado,
  } = useVehiculos();

  const {
    trabajosByVehiculo,
    loading: trabajosLoading,
    error: trabajosError,
    fetchTrabajosByVehiculo,
  } = useTrabajos();

  useEffect(() => {
    if (!id) return;

    fetchVehiculoById(id);

    fetchTrabajosByVehiculo(id);

    return () => {
      clearVehiculoSeleccionado();
    };
  }, [
    id,
    fetchVehiculoById,
    fetchTrabajosByVehiculo,
    clearVehiculoSeleccionado,
  ]);

  const fechaAlta = useMemo(() => {
    if (!vehiculoSeleccionado) {
      return "—";
    }

    return new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(new Date(vehiculoSeleccionado.created_at));
  }, [vehiculoSeleccionado]);

  const loading = vehiculoLoading || trabajosLoading;

  const error = vehiculoError ?? trabajosError;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">Cargando vehículo...</p>
      </div>
    );
  }

  if (error || !vehiculoSeleccionado) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">{error ?? "Vehículo no encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit px-0"
        onClick={() => navigate("/vehiculos")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Volver
      </Button>

      <PageHeader
        title={`${vehiculoSeleccionado.marca ?? ""}
          ${vehiculoSeleccionado.modelo ?? ""}`}
        description={`Patente ${vehiculoSeleccionado.patente}`}
      />

      <StatsGrid>
        <StatCard
          icon={<Car className="size-5" />}
          iconClass="bg-blue-100 text-blue-700"
          label="Patente"
          value={vehiculoSeleccionado.patente}
          footer="Dominio registrado"
        />

        <StatCard
          icon={<CalendarDays className="size-5" />}
          iconClass="bg-green-100 text-green-700"
          label="Antigüedad"
          value={fechaAlta}
          footer="Fecha de alta del vehículo"
        />

        <StatCard
          icon={<Palette className="size-5" />}
          iconClass="bg-violet-100 text-violet-700"
          label="Color"
          value={vehiculoSeleccionado.color ?? "—"}
          footer={
            vehiculoSeleccionado.codigo_color
              ? `Código: ${vehiculoSeleccionado.codigo_color}`
              : "Sin código"
          }
        />
      </StatsGrid>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Información del vehículo</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Marca</p>

            <p className="font-medium">{vehiculoSeleccionado.marca ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Modelo</p>

            <p className="font-medium">{vehiculoSeleccionado.modelo ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Año</p>

            <p className="font-medium">{vehiculoSeleccionado.anio ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Código color</p>

            <p className="font-medium">
              {vehiculoSeleccionado.codigo_color ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Historial de órdenes de trabajo
        </h2>

        <VehiculoHistorialOT trabajos={trabajosByVehiculo} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Historial de services</h2>

        <VehiculoHistorialServices
          trabajos={trabajosByVehiculo}
          onVerTrabajo={(id) => navigate(`/trabajos/${id}`)}
        />
      </div>
    </div>
  );
}

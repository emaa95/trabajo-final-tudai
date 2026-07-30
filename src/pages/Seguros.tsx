import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { Plus, Shield, ShieldCheck, ShieldOff } from "lucide-react";

import { sileo } from "sileo";

import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/StatsGrid";
import { StatCard } from "@/components/common/StatCard";
import { DataFilters } from "@/components/common/DataFilters";
import { DataTable } from "@/components/common/DataTable";

import { useDataFilters } from "@/hooks/useDataFilters";
import { useAseguradoras } from "@/hooks/useAseguradoras";

import { createAseguradoraColumns } from "@/components/aseguradoras/AseguradoraColumns";

import { ModalAseguradora } from "@/components/modals/ModalAseguradora";

const SORT_OPTIONS = [
  {
    value: "nombre",
    label: "Nombre A–Z",
  },
  {
    value: "reciente",
    label: "Más reciente",
  },
];

const FILTER_GROUPS = [
  {
    id: "estado",
    options: [
      {
        value: "todas",
        label: "Todas",
      },
      {
        value: "activas",
        label: "Activas",
      },
      {
        value: "inactivas",
        label: "Inactivas",
      },
    ],
  },
];

export function Seguros() {
  const { aseguradoras, fetchAseguradoras, loading, error } = useAseguradoras();

  const [open, setOpen] = useState(false);

  const { search, sortBy, activeFilters, filterProps } = useDataFilters({
    defaultSort: "nombre",
    defaultFilters: {
      estado: "todas",
    },
  });

  useEffect(() => {
    fetchAseguradoras();
  }, [fetchAseguradoras]);

  useEffect(() => {
    if (error) {
      sileo.error({
        title: "Error al cargar aseguradoras",
        description: error,
      });
    }
  }, [error]);

  const columns = useMemo(
    () =>
      createAseguradoraColumns({
        onVerDetalle: (aseguradora) => {
          console.log("ver detalle", aseguradora);
        },

        onEditar: (aseguradora) => {
          console.log("editar", aseguradora);
        },

        onCambiarEstado: (aseguradora) => {
          console.log("cambiar estado", aseguradora);
        },
      }),

    [],
  );

  const activas = useMemo(
    () => aseguradoras.filter((a) => a.activa).length,

    [aseguradoras],
  );

  const inactivas = useMemo(
    () => aseguradoras.filter((a) => !a.activa).length,

    [aseguradoras],
  );

  const creadasEsteMes = useMemo(() => {
    const now = new Date();

    return aseguradoras.filter((aseguradora) => {
      const fecha = new Date(aseguradora.created_at);

      return (
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [aseguradoras]);

  const filteredAseguradoras = useMemo(() => {
    const q = search.toLowerCase();

    let result = aseguradoras.filter(
      (aseguradora) =>
        aseguradora.nombre.toLowerCase().includes(q) ||
        (aseguradora.cuit ?? "").toLowerCase().includes(q) ||
        (aseguradora.telefono ?? "").toLowerCase().includes(q),
    );

    const estado = activeFilters.estado ?? "todas";

    if (estado === "activas") {
      result = result.filter((a) => a.activa);
    }

    if (estado === "inactivas") {
      result = result.filter((a) => !a.activa);
    }

    if (sortBy === "nombre") {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    if (sortBy === "reciente") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return result;
  }, [aseguradoras, search, sortBy, activeFilters]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">Cargando aseguradoras...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Compañías de Seguros"
          description="Gestión de aseguradoras del taller"
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 size-4" />
              Nueva Aseguradora
            </Button>
          }
        />

        <StatsGrid>
          <StatCard
            icon={<Shield className="size-5" />}
            iconClass="theme-seguro bg-primary/10 text-primary"
            label="Aseguradoras"
            value={aseguradoras.length}
            footer={`+${creadasEsteMes} este mes`}
          />

          <StatCard
            icon={<ShieldCheck className="size-5" />}
            iconClass="bg-green-100 text-green-700"
            label="Activas"
            value={activas}
            footer="Disponibles para trabajos"
          />

          <StatCard
            icon={<ShieldOff className="size-5" />}
            iconClass="bg-amber-100 text-amber-700"
            label="Inactivas"
            value={inactivas}
            footer={`${Math.round(
              aseguradoras.length ? (inactivas / aseguradoras.length) * 100 : 0,
            )}% del total`}
            trend="neutral"
          />
        </StatsGrid>

        <DataFilters
          {...filterProps}
          searchPlaceholder="Buscar por nombre, CUIT o teléfono..."
          sortOptions={SORT_OPTIONS}
          filterGroups={FILTER_GROUPS}
        />

        <DataTable
          data={filteredAseguradoras}
          columns={columns}
          getRowKey={(aseguradora) => aseguradora.id}
          loading={loading}
          headerColorClass="theme-seguro text-primary"
          emptyTitle="No hay aseguradoras registradas"
          emptyDescription="Intentá con otra búsqueda o agregá una nueva aseguradora."
          emptyIcon={<Shield className="size-14 text-slate-300" />}
        />
      </div>

      <ModalAseguradora open={open} onClose={() => setOpen(false)} />
    </>
  );
}

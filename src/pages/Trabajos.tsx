import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  Plus,
  List,
  Kanban as KanbanIcon,
} from "lucide-react";

import type { DropResult } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import { DataFilters } from "@/components/common/DataFilters";

import { TrabajoListView } from "@/components/trabajos/TrabajoListView";
import { TrabajoKanbanView } from "@/components/trabajos/TrabajoKanbanView";

import { useTrabajos } from "@/hooks/useTrabajos";
import { useDataFilters } from "@/hooks/useDataFilters";

import type {
  EstadoTrabajo,
} from "@/types";

import { ESTADOS_TRABAJO } from "@/types";

// ─────────────────────────────────────────────
// Configuración de filtros
// ─────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "reciente", label: "Más reciente" },
  { value: "antiguo", label: "Más antiguo" },
];

const LIST_FILTER_GROUPS = [
  {
    id: "estado",
    options: [
      { value: "todos", label: "Todos" },
      ...ESTADOS_TRABAJO.map((estado) => ({
        value: estado,
        label: estado,
      })),
    ],
  },
  {
    id: "tipo",
    options: [
      { value: "todos", label: "Todos" },
      { value: "Particular", label: "Particular" },
      { value: "Seguro", label: "Seguro" },
    ],
  },
];

const KANBAN_FILTER_GROUPS = [
  {
    id: "tipo",
    options: [
      { value: "todos", label: "Todos" },
      { value: "Particular", label: "Particular" },
      { value: "Seguro", label: "Seguro" },
    ],
  },
];

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

export function Trabajos() {
  const [vista, setVista] =
    useState<"lista" | "kanban">("kanban");

  const {
    trabajos,
    loading,
    error,
    fetchTrabajos,
    updateTrabajo,
  } = useTrabajos();

  const {
    search,
    sortBy,
    activeFilters,
    filterProps,
  } = useDataFilters({
    defaultSort: "reciente",
    defaultFilters: {
      estado: "todos",
      tipo: "todos",
    },
  });

  useEffect(() => {
    fetchTrabajos();
  }, [fetchTrabajos]);

  const handleDragEnd = async (
    result: DropResult,
  ) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const nuevoEstado =
      destination.droppableId as EstadoTrabajo;

    try {
      await updateTrabajo(draggableId, {
        estado: nuevoEstado,
      });
    } catch (error) {
      console.error(
        "Error al actualizar estado:",
        error,
      );
    }
  };

  const filteredTrabajos = useMemo(() => {
    let result = [...trabajos];

    const q = search.toLowerCase();

    if (q) {
      result = result.filter(
        (t) =>
          t.vehiculo.patente
            .toLowerCase()
            .includes(q) ||
          t.vehiculo.modelo
            .toLowerCase()
            .includes(q) ||
          t.vehiculo.cliente.nombre
            .toLowerCase()
            .includes(q),
      );
    }

    // Estado sólo aplica a la vista lista
    if (vista === "lista") {
      const estado =
        activeFilters.estado ?? "todos";

      if (estado !== "todos") {
        result = result.filter(
          (t) => t.estado === estado,
        );
      }
    }

    const tipo =
      activeFilters.tipo ?? "todos";

    if (tipo !== "todos") {
      result = result.filter(
        (t) => t.tipo === tipo,
      );
    }

    if (sortBy === "reciente") {
      result.sort(
        (a, b) =>
          new Date(
            b.fecha_ingreso,
          ).getTime() -
          new Date(
            a.fecha_ingreso,
          ).getTime(),
      );
    }

    if (sortBy === "antiguo") {
      result.sort(
        (a, b) =>
          new Date(
            a.fecha_ingreso,
          ).getTime() -
          new Date(
            b.fecha_ingreso,
          ).getTime(),
      );
    }

    return result;
  }, [
    trabajos,
    search,
    sortBy,
    activeFilters,
    vista,
  ]);

  const showLoading =
    loading && trabajos.length === 0;

  if (showLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Cargando trabajos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col gap-4 px-6 pb-4 flex-shrink-0 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Trabajos
          </h1>

          <p className="mt-1 text-slate-600">
            Gestión de trabajos del taller
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() =>
                setVista("lista")
              }
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md
                text-sm font-medium transition-colors
                ${
                  vista === "lista"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              <List className="size-4" />
              Lista
            </button>

            <button
              onClick={() =>
                setVista("kanban")
              }
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md
                text-sm font-medium transition-colors
                ${
                  vista === "kanban"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              <KanbanIcon className="size-4" />
              Kanban
            </button>
          </div>

          <Link to="/trabajos/nuevo">
            <Button>
              <Plus className="mr-2 size-4" />
              Nuevo Trabajo
            </Button>
          </Link>
        </div>
      </div>

      {/* FILTROS */}
      <div className="px-6 pb-4 flex-shrink-0">
        <DataFilters
          {...filterProps}
          searchPlaceholder="Buscar por patente, cliente o vehículo..."
          sortOptions={SORT_OPTIONS}
          filterGroups={
            vista === "kanban"
              ? KANBAN_FILTER_GROUPS
              : LIST_FILTER_GROUPS
          }
        />
      </div>

      {/* VISTA */}
      {vista === "lista" && (
        <TrabajoListView
          trabajos={filteredTrabajos}
        />
      )}

      {vista === "kanban" && (
        <TrabajoKanbanView
          trabajos={filteredTrabajos}
          onDragEnd={handleDragEnd}
        />
      )}
    </div>
  );
}
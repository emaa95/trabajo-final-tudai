import { Link } from "react-router-dom";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Shield, GripVertical } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TipoBadge } from "../common/Badges";

import type { EstadoTrabajo, TrabajoDetalle } from "@/types";
import { ESTADOS_TRABAJO } from "@/types";

import { estadoConfig } from "./trabajoConfig";

// ======================================================
// HELPERS
// ======================================================

function getDiasEnTaller(fecha: string) {
  const ingreso = new Date(fecha);
  const hoy = new Date();

  const diff = Math.floor(
    (hoy.getTime() - ingreso.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diff <= 0) return "Hoy";
  if (diff === 1) return "1 día";

  return `${diff} días`;
}

// ======================================================
// CARD
// ======================================================

interface TrabajoCardProps {
  trabajo: TrabajoDetalle;
  index: number;
}

function TrabajoCard({ trabajo, index }: TrabajoCardProps) {
  const config = estadoConfig[trabajo.estado];

  const seguro = trabajo.seguro?.[0];

  const diasEnTaller = Math.floor(
    (Date.now() - new Date(trabajo.fecha_ingreso).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const vehiculo = trabajo.vehiculo;
  const cliente = vehiculo?.cliente;

  return (
    <Draggable draggableId={trabajo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            bg-white
            rounded-xl
            border
            border-slate-200
            border-l-4
            ${config.borderClass}
            transition-all
            duration-200
            hover:shadow-lg
            hover:-translate-y-0.5
            hover:border-slate-300
            ${
              snapshot.isDragging
                ? "shadow-2xl ring-2 ring-blue-400 rotate-1"
                : ""
            }
          `}
        >
          <Link to={`/trabajos/${trabajo.id}`} className="block">
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-bold tracking-wider">
                  {vehiculo?.patente ?? "SIN PATENTE"}
                </span>

                <div
                  {...provided.dragHandleProps}
                  className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing shrink-0"
                  onClick={(e) => e.preventDefault()}
                >
                  <GripVertical className="size-4" />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {cliente?.nombre ?? "Sin cliente"}
                </p>

                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {vehiculo?.modelo ?? "Sin vehículo"}
                </p>
              </div>

              {trabajo.tipo === "Seguro" && seguro && (
                <div className="inline-flex items-center gap-1 px-2 py-1 mt-2 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium max-w-full">
                  <Shield className="size-3 shrink-0" />

                  <span className="truncate">
                    {seguro.aseguradora?.nombre ?? "Sin aseguradora"}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
  <div className="flex flex-col gap-1">
    <TipoBadge tipo={trabajo.tipo} />

    <span
      className={`
        inline-flex w-fit items-center px-2 py-1 rounded-full text-[11px] font-medium
        ${
          trabajo.pagado
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
        }
      `}
    >
      {trabajo.pagado ? "Pagada" : "Pendiente de pago"}
    </span>
  </div>

  <span
    className={`
      text-[11px]
      font-medium
      ${
        diasEnTaller >= 10
          ? "text-amber-600"
          : "text-slate-500"
      }
    `}
  >
    {getDiasEnTaller(trabajo.fecha_ingreso)}
  </span>
</div>
            </div>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

// ======================================================
// COLUMN
// ======================================================

interface KanbanColumnProps {
  estado: EstadoTrabajo;
  trabajos: TrabajoDetalle[];
}

function KanbanColumn({ estado, trabajos }: KanbanColumnProps) {
  const config = estadoConfig[estado];
  const Icon = config.icon;

  return (
    <Droppable droppableId={estado}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            w-70
            shrink-0
            flex
            flex-col
            rounded-xl
            transition-all
            py-5
            ml-2
            ${
              snapshot.isDraggingOver
                ? "ring-2 ring-blue-500 ring-offset-2"
                : ""
            }
          `}
        >
          <Card className="flex flex-col h-full bg-white border-slate-200 shadow-sm overflow-hidden py-0">
            <CardHeader
              className={`${config.headerClass} py-3 px-3 border-b`}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="size-4 shrink-0" />

                  <span className="text-sm font-semibold truncate">
                    {estado}
                  </span>
                </div>

                <span className="min-w-6 h-6 flex items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm">
                  {trabajos.length}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0 bg-slate-50/40">
              <div className="p-2 space-y-2">
                {trabajos.map((trabajo, index) => (
                  <TrabajoCard
                    key={trabajo.id}
                    trabajo={trabajo}
                    index={index}
                  />
                ))}

                {provided.placeholder}

                {trabajos.length === 0 && (
                  <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-slate-200 text-xs text-slate-400 bg-white">
                    Sin trabajos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Droppable>
  );
}

// ======================================================
// MAIN VIEW
// ======================================================

interface TrabajoKanbanViewProps {
  trabajos: TrabajoDetalle[];
  onDragEnd: (result: DropResult) => void;
}

export function TrabajoKanbanView({
  trabajos,
  onDragEnd,
}: TrabajoKanbanViewProps) {
  const trabajosValidos = trabajos.filter(Boolean);

  const estadosVisibles = ESTADOS_TRABAJO.filter(
    (estado) =>
      estado !== "Cancelada" &&
      estado !== "Entregado"
  );

  const pendientes = trabajosValidos.filter(
    (t) => t.estado === "Pendiente"
  ).length;

  const enProceso = trabajosValidos.filter(
    (t) => t.estado === "En reparación"
  ).length;

  const entregados = trabajosValidos.filter(
    (t) => t.estado === "Entregado"
  ).length;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col flex-1 min-h-0 px-4">
        <div className="flex gap-2 mb-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-full bg-slate-100 text-sm font-medium">
            {trabajosValidos.length} Total
          </div>

          <div className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
            {pendientes} Pendientes
          </div>

          <div className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            {enProceso} En reparación
          </div>

          <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
            {entregados} Entregados
          </div>
        </div>

        <div className="flex gap-3 flex-1 min-h-0 overflow-x-auto">
          {estadosVisibles.map((estado) => (
            <KanbanColumn
              key={estado}
              estado={estado}
              trabajos={trabajosValidos.filter(
                (t) => t.estado === estado
              )}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
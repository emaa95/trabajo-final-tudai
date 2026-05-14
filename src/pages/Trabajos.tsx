import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

import {
  Eye,
  Plus,
  Filter,
  List,
  Kanban as KanbanIcon,
  Clock,
  Wrench,
  Paintbrush,
  CheckCircle2,
  PauseCircle,
  Ban,
  Shield,
  GripVertical,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

import { Button } from '../components/ui/button';

import {
  EstadoBadge,
  TipoBadge,
} from '../components/common/Badges';

import {
  trabajos as initialTrabajos,
  getVehiculoById,
  getClienteById,
} from '../data';

import type {
  EstadoTrabajo,
  TipoTrabajo,
  Trabajo,
} from '../types';

import { ESTADOS_TRABAJO} from '../types';

// ─────────────────────────────────────────────
// config
// ─────────────────────────────────────────────

const estadoConfig: Record<
  EstadoTrabajo,
  {
    icon: React.ElementType;
    headerClass: string;
  }
> = {
  Pendiente: {
    icon: Clock,
    headerClass: 'bg-gray-100 text-gray-700',
  },

  'En reparación': {
    icon: Wrench,
    headerClass: 'bg-orange-100 text-orange-700',
  },

  'En pintura': {
    icon: Paintbrush,
    headerClass: 'bg-blue-100 text-blue-700',
  },

  Pausada: {
    icon: PauseCircle,
    headerClass: 'bg-yellow-100 text-yellow-700',
  },

  'Listo para entregar': {
    icon: CheckCircle2,
    headerClass: 'bg-emerald-100 text-emerald-700',
  },

  Entregado: {
    icon: CheckCircle2,
    headerClass: 'bg-green-100 text-green-700',
  },

  Cancelada: {
    icon: Ban,
    headerClass: 'bg-red-100 text-red-700',
  },
};

// ─────────────────────────────────────────────
// card
// ─────────────────────────────────────────────

interface TrabajoCardProps {
  trabajo: Trabajo;
  index: number;
}

function TrabajoCard({
  trabajo,
  index,
}: TrabajoCardProps) {
  const vehiculo = getVehiculoById(
    trabajo.vehiculoId
  );

  const cliente = getClienteById(
    trabajo.clienteId
  );

  return (
    <Draggable
      draggableId={trabajo.id}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            bg-white rounded-lg border shadow-sm
            hover:shadow-md transition-all
            ${
              snapshot.isDragging
                ? 'rotate-1 shadow-xl'
                : ''
            }
          `}
        >
          <div className="p-4 space-y-3">
            {/* header */}

            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">
                  {vehiculo?.patente}
                </p>

                <p className="text-sm text-slate-600">
                  {vehiculo?.marca}{' '}
                  {vehiculo?.modelo}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <TipoBadge tipo={trabajo.tipo} />

                {/* drag handle */}

                <button
                  {...provided.dragHandleProps}
                  className="
                    text-slate-400
                    hover:text-slate-600
                    cursor-grab
                    active:cursor-grabbing
                  "
                >
                  <GripVertical className="size-4" />
                </button>
              </div>
            </div>

            {/* cliente */}

            <div className="text-sm text-slate-600">
              <p className="font-medium">
                {cliente?.nombre}
              </p>

              <p className="text-xs">
                {cliente?.telefono}
              </p>
            </div>

            {/* seguro */}

            {trabajo.tipo === 'Seguro' &&
              trabajo.seguro && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Shield className="size-3" />

                  <span>
                    {trabajo.seguro.compania}
                  </span>
                </div>
              )}

            {/* footer */}

            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {new Date(
                  trabajo.fechaIngreso
                ).toLocaleDateString(
                  'es-AR'
                )}
              </div>

              <Link
                to={`/trabajos/${trabajo.id}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <Eye className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ─────────────────────────────────────────────
// column
// ─────────────────────────────────────────────

interface KanbanColumnProps {
  estado: EstadoTrabajo;
  trabajos: Trabajo[];
}

function KanbanColumn({
  estado,
  trabajos,
}: KanbanColumnProps) {
  const config = estadoConfig[estado];

  const Icon = config.icon;

  return (
    <Droppable droppableId={estado}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            flex-1 min-w-[320px]
            transition-all
            ${
              snapshot.isDraggingOver
                ? 'ring-2 ring-blue-500 ring-offset-2 rounded-xl'
                : ''
            }
          `}
        >
          <Card className="h-full">
            <CardHeader
              className={`${config.headerClass} rounded-t-lg`}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="size-5" />

                  <EstadoBadge estado={estado} />
                </div>

                <span className="text-sm font-normal">
                  {trabajos.length}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3 min-h-125">
              {trabajos.map(
                (trabajo, index) => (
                  <TrabajoCard
                    key={trabajo.id}
                    trabajo={trabajo}
                    index={index}
                  />
                )
              )}

              {provided.placeholder}

              {trabajos.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-sm">
                    Sin trabajos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Droppable>
  );
}

// ─────────────────────────────────────────────
// main
// ─────────────────────────────────────────────

export function Trabajos() {
  const [vista, setVista] =
    useState<'lista' | 'kanban'>(
      'kanban'
    );

  const [filtroEstado, setFiltroEstado] =
    useState<
      EstadoTrabajo | 'Todos'
    >('Todos');

  const [filtroTipo, setFiltroTipo] =
    useState<
      TipoTrabajo | 'Todos'
    >('Todos');

  const [trabajosKanban, setTrabajosKanban] =
    useState(initialTrabajos);

  // ─────────────────────────────────────────

  const trabajosFiltrados =
    useMemo(() => {
      return trabajosKanban.filter(
        (trabajo) => {
          const matchEstado =
            filtroEstado === 'Todos' ||
            trabajo.estado ===
              filtroEstado;

          const matchTipo =
            filtroTipo === 'Todos' ||
            trabajo.tipo ===
              filtroTipo;

          return (
            matchEstado &&
            matchTipo
          );
        }
      );
    }, [
      trabajosKanban,
      filtroEstado,
      filtroTipo,
    ]);

  // ─────────────────────────────────────────

  const handleDragEnd = (
    result: DropResult
  ) => {
    const { destination, draggableId } =
      result;

    if (!destination) return;

    const nuevoEstado =
      destination
        .droppableId as EstadoTrabajo;

    setTrabajosKanban((prev) =>
      prev.map((trabajo) =>
        trabajo.id === draggableId
          ? {
              ...trabajo,
              estado: nuevoEstado,
            }
          : trabajo
      )
    );
  };

  // ─────────────────────────────────────────

  const formatFecha = (
    fecha: string
  ) =>
    new Date(fecha).toLocaleDateString(
      'es-AR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );

  // ─────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Trabajos
          </h1>

          <p className="text-slate-600 mt-1">
            Gestión de trabajos del
            taller
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* toggle */}

          <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
            <button
              onClick={() =>
                setVista('lista')
              }
              className={`
                flex items-center gap-2
                px-3 py-1.5 rounded-md
                text-sm font-medium
                transition-colors
                ${
                  vista === 'lista'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              <List className="size-4" />
              Lista
            </button>

            <button
              onClick={() =>
                setVista('kanban')
              }
              className={`
                flex items-center gap-2
                px-3 py-1.5 rounded-md
                text-sm font-medium
                transition-colors
                ${
                  vista === 'kanban'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              <KanbanIcon className="size-4" />
              Kanban
            </button>
          </div>

          <Link to="/trabajos/nuevo">
            <Button>
              <Plus className="size-4 mr-2" />
              Nuevo Trabajo
            </Button>
          </Link>
        </div>
      </div>

      {/* lista */}

      {vista === 'lista' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="size-5" />
                Filtros
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* estado */}

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Estado
                  </label>

                  <select
                    value={filtroEstado}
                    onChange={(e) =>
                      setFiltroEstado(
                        e.target
                          .value as EstadoTrabajo
                      )
                    }
                    className="
                      w-full px-4 py-2
                      border rounded-lg
                    "
                  >
                    <option value="Todos">
                      Todos los estados
                    </option>

                    {ESTADOS_TRABAJO.map(
                      (estado) => (
                        <option
                          key={estado}
                          value={estado}
                        >
                          {estado}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* tipo */}

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Tipo
                  </label>

                  <select
                    value={filtroTipo}
                    onChange={(e) =>
                      setFiltroTipo(
                        e.target
                          .value as TipoTrabajo
                      )
                    }
                    className="
                      w-full px-4 py-2
                      border rounded-lg
                    "
                  >
                    <option value="Todos">
                      Todos los tipos
                    </option>

                    <option value="Particular">
                      Particular
                    </option>

                    <option value="Seguro">
                      Seguro
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                Mostrando{' '}
                {trabajosFiltrados.length}{' '}
                de {trabajosKanban.length}{' '}
                trabajos
              </div>
            </CardContent>
          </Card>

          {/* tabla */}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        Vehículo
                      </TableHead>

                      <TableHead>
                        Cliente
                      </TableHead>

                      <TableHead>
                        Tipo
                      </TableHead>

                      <TableHead>
                        Estado
                      </TableHead>

                      <TableHead>
                        Ingreso
                      </TableHead>

                      <TableHead>
                        Descripción
                      </TableHead>

                      <TableHead className="text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {trabajosFiltrados.map(
                      (trabajo) => {
                        const vehiculo =
                          getVehiculoById(
                            trabajo.vehiculoId
                          );

                        const cliente =
                          getClienteById(
                            trabajo.clienteId
                          );

                        return (
                          <TableRow
                            key={trabajo.id}
                          >
                            <TableCell>
                              <div>
                                <div className="font-semibold">
                                  {
                                    vehiculo?.patente
                                  }
                                </div>

                                <div className="text-sm text-slate-500">
                                  {
                                    vehiculo?.marca
                                  }{' '}
                                  {
                                    vehiculo?.modelo
                                  }
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {
                                    cliente?.nombre
                                  }
                                </div>

                                <div className="text-sm text-slate-500">
                                  {
                                    cliente?.telefono
                                  }
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <TipoBadge
                                tipo={
                                  trabajo.tipo
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <EstadoBadge
                                estado={
                                  trabajo.estado
                                }
                              />
                            </TableCell>

                            <TableCell>
                              {formatFecha(
                                trabajo.fechaIngreso
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              <Link
                                to={`/trabajos/${trabajo.id}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Eye className="size-4 mr-2" />
                                  Ver
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* kanban */}

      {vista === 'kanban' && (
        <DragDropContext
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Arrastrá tarjetas entre
              columnas para actualizar
              estados.
            </p>

            {/* counters */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {ESTADOS_TRABAJO.map(
                (estado) => {
                  const count =
                    trabajosKanban.filter(
                      (t) =>
                        t.estado ===
                        estado
                    ).length;

                  return (
                    <Card key={estado}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {count}
                          </p>

                          <p className="text-sm text-slate-600">
                            {estado}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>

            {/* board */}

            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {ESTADOS_TRABAJO.map(
                  (estado) => (
                    <KanbanColumn
                      key={estado}
                      estado={estado}
                      trabajos={trabajosKanban.filter(
                        (t) =>
                          t.estado ===
                          estado
                      )}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
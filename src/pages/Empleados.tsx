import { useState } from 'react';

import { Card, CardContent } from '../components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

import { Button } from '../components/ui/button';

import type {
  Empleado,
  RolEmpleado,
} from '../types';

import {
  Plus,
  Phone,
  Mail,
  Pencil,
  UserX,
  UserCheck,
  Search,
  UserCog,
} from 'lucide-react';

import { useEmpleados } from '@/hooks/useEmpleados';

import {
  EmpleadoModal,
  type EmpleadoFormData,
} from '@/components/empleados/EmpleadoModal';

const ROLES: RolEmpleado[] = [
  'Chapista',
  'Pintor',
  'Mecánico',
  'Administrativo',
];

const rolColors: Record<
  RolEmpleado,
  string
> = {
  Chapista:
    'bg-orange-100 text-orange-700',

  Pintor:
    'bg-blue-100 text-blue-700',

  Mecánico:
    'bg-purple-100 text-purple-700',

  Administrativo:
    'bg-slate-100 text-slate-700',
};

const emptyForm: EmpleadoFormData =
  {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    rol: 'Chapista',
    fecha_ingreso: '',
  };

export function Empleados() {
  const {
    empleados: lista,

    loading,
    error,

    crearEmpleado,
    actualizarEmpleado,
    toggleEmpleadoActivo,
  } = useEmpleados();

  const [busqueda, setBusqueda] =
    useState('');

  const [filtroRol, setFiltroRol] =
    useState<RolEmpleado | 'Todos'>(
      'Todos'
    );

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState<
    'Todos' | 'Activos' | 'Inactivos'
  >('Todos');

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [
    empleadoEditando,
    setEmpleadoEditando,
  ] = useState<Empleado | null>(
    null
  );

  const [form, setForm] =
    useState<EmpleadoFormData>(
      emptyForm
    );

  const [errors, setErrors] =
    useState<
      Partial<EmpleadoFormData>
    >({});

  const [
    confirmarDesactivar,
    setConfirmarDesactivar,
  ] = useState<Empleado | null>(
    null
  );

  // ==================== FILTRADO ====================

  const empleadosFiltrados =
    lista.filter((e) => {
      const texto =
        busqueda.toLowerCase();

      const coincideTexto =
        !busqueda ||
        e.nombre
          .toLowerCase()
          .includes(texto) ||
        e.apellido
          .toLowerCase()
          .includes(texto) ||
        e.dni.includes(texto) ||
        e.telefono.includes(texto) ||
        (e.email
          ?.toLowerCase()
          .includes(texto) ??
          false);

      const coincideRol =
        filtroRol === 'Todos' ||
        e.rol === filtroRol;

      const coincideEstado =
        filtroEstado === 'Todos' ||
        (filtroEstado === 'Activos'
          ? e.activo
          : !e.activo);

      return (
        coincideTexto &&
        coincideRol &&
        coincideEstado
      );
    });

  // ==================== MODAL ====================

  const abrirModalNuevo = () => {
    setEmpleadoEditando(null);

    setForm(emptyForm);

    setErrors({});

    setModalAbierto(true);
  };

  const abrirModalEditar = (
    emp: Empleado
  ) => {
    setEmpleadoEditando(emp);

    setForm({
      nombre: emp.nombre,
      apellido: emp.apellido,
      dni: emp.dni,
      telefono: emp.telefono,
      email: emp.email ?? '',
      rol: emp.rol,
      fecha_ingreso:
        emp.fecha_ingreso,
    });

    setErrors({});

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);

    setEmpleadoEditando(null);

    setForm(emptyForm);

    setErrors({});
  };

  const handleChange = (
    field: keyof EmpleadoFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // ==================== VALIDACIÓN ====================

  const validar = (): boolean => {
    const e: Partial<
      EmpleadoFormData
    > = {};

    if (!form.nombre.trim()) {
      e.nombre =
        'El nombre es requerido.';
    }

    if (!form.apellido.trim()) {
      e.apellido =
        'El apellido es requerido.';
    }

    if (!form.dni.trim()) {
      e.dni = 'El DNI es requerido.';
    }

    if (!form.telefono.trim()) {
      e.telefono =
        'El teléfono es requerido.';
    }

    if (!form.fecha_ingreso) {
      e.fecha_ingreso =
        'La fecha de ingreso es requerida.';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  // ==================== GUARDAR ====================

  const guardar = async () => {
    if (!validar()) return;

    try {
      if (empleadoEditando) {
        await actualizarEmpleado(
          empleadoEditando.id,
          {
            nombre:
              form.nombre.trim(),

            apellido:
              form.apellido.trim(),

            dni:
              form.dni.trim(),

            telefono:
              form.telefono.trim(),

            email:
              form.email.trim() ||
              undefined,

            rol: form.rol,

            fecha_ingreso:
              form.fecha_ingreso,
          }
        );
      } else {
        await crearEmpleado({
          nombre:
            form.nombre.trim(),

          apellido:
            form.apellido.trim(),

          dni:
            form.dni.trim(),

          telefono:
            form.telefono.trim(),

          email:
            form.email.trim() ||
            undefined,

          rol: form.rol,

          activo: true,

          fecha_ingreso:
            form.fecha_ingreso,
        });
      }

      cerrarModal();
    } catch (error) {
      console.error(error);
    }
  };

  // ==================== ACTIVAR / DESACTIVAR ====================

  const toggleActivo = async (
    emp: Empleado
  ) => {
    if (emp.activo) {
      setConfirmarDesactivar(emp);
    } else {
      try {
        await toggleEmpleadoActivo(
          emp.id,
          true
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const confirmarDesactivacion =
    async () => {
      if (!confirmarDesactivar)
        return;

      try {
        await toggleEmpleadoActivo(
          confirmarDesactivar.id,
          false
        );

        setConfirmarDesactivar(
          null
        );
      } catch (error) {
        console.error(error);
      }
    };

  // ==================== STATS ====================

  const totalActivos =
    lista.filter((e) => e.activo)
      .length;

  const totalInactivos =
    lista.filter((e) => !e.activo)
      .length;

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="p-6">
        Cargando empleados...
      </div>
    );
  }

  // ==================== ERROR ====================

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Empleados
          </h1>

          <p className="mt-1 text-slate-600">
            Gestión del personal del
            taller ({lista.length}{' '}
            registrados)
          </p>
        </div>

        <Button
          className="w-full lg:w-auto"
          onClick={abrirModalNuevo}
        >
          <Plus className="mr-2 size-4" />
          Nuevo Empleado
        </Button>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total"
          value={lista.length}
          color="text-slate-700"
        />

        <StatCard
          label="Activos"
          value={totalActivos}
          color="text-emerald-600"
        />

        <StatCard
          label="Inactivos"
          value={totalInactivos}
          color="text-red-500"
        />

        <StatCard
          label="Roles"
          value={
            new Set(
              lista.map((e) => e.rol)
            ).size
          }
          color="text-blue-600"
        />
      </div>

      {/* FILTROS */}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar por nombre, DNI, email..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filtroRol}
              onChange={(e) =>
                setFiltroRol(
                  e.target
                    .value as
                    | RolEmpleado
                    | 'Todos'
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">
                Todos los roles
              </option>

              {ROLES.map((r) => (
                <option
                  key={r}
                  value={r}
                >
                  {r}
                </option>
              ))}
            </select>

            <select
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(
                  e.target.value as
                    | 'Todos'
                    | 'Activos'
                    | 'Inactivos'
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">
                Todos los estados
              </option>

              <option value="Activos">
                Activos
              </option>

              <option value="Inactivos">
                Inactivos
              </option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* TABLA */}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Empleado
                  </TableHead>

                  <TableHead>
                    DNI
                  </TableHead>

                  <TableHead>
                    Contacto
                  </TableHead>

                  <TableHead>
                    Rol
                  </TableHead>

                  <TableHead>
                    Fecha Ingreso
                  </TableHead>

                  <TableHead>
                    Estado
                  </TableHead>

                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {empleadosFiltrados.length ===
                0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-slate-400"
                    >
                      No se encontraron
                      empleados con los
                      filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  empleadosFiltrados.map(
                    (emp) => (
                      <TableRow
                        key={emp.id}
                        className={
                          !emp.activo
                            ? 'bg-slate-50 opacity-60'
                            : ''
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                emp.activo
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {
                                emp.nombre[0]
                              }
                              {
                                emp
                                  .apellido[0]
                              }
                            </div>

                            <div>
                              <div className="font-semibold text-slate-900">
                                {
                                  emp.nombre
                                }{' '}
                                {
                                  emp.apellido
                                }
                              </div>

                              <div className="text-xs text-slate-400">
                                #
                                {emp.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-slate-600">
                          {emp.dni}
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Phone className="size-3.5 shrink-0" />

                              {
                                emp.telefono
                              }
                            </div>

                            {emp.email && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Mail className="size-3.5 shrink-0" />

                                {
                                  emp.email
                                }
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${rolColors[emp.rol]}`}
                          >
                            <UserCog className="size-3" />

                            {emp.rol}
                          </span>
                        </TableCell>

                        <TableCell className="text-sm text-slate-600">
                          {new Date(
                            emp.fecha_ingreso +
                              'T00:00:00'
                          ).toLocaleDateString(
                            'es-AR',
                            {
                              day: '2-digit',
                              month:
                                '2-digit',
                              year:
                                'numeric',
                            }
                          )}
                        </TableCell>

                        <TableCell>
                          {emp.activo ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />

                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
                              <span className="inline-block size-1.5 rounded-full bg-red-400" />

                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                abrirModalEditar(
                                  emp
                                )
                              }
                              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </button>

                            <button
                              onClick={() =>
                                toggleActivo(
                                  emp
                                )
                              }
                              title={
                                emp.activo
                                  ? 'Desactivar'
                                  : 'Reactivar'
                              }
                              className={`rounded-lg p-1.5 transition-colors ${
                                emp.activo
                                  ? 'text-slate-500 hover:bg-red-50 hover:text-red-600'
                                  : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                            >
                              {emp.activo ? (
                                <UserX className="size-4" />
                              ) : (
                                <UserCheck className="size-4" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL EMPLEADO */}

      <EmpleadoModal
        open={modalAbierto}
        empleadoEditando={
          empleadoEditando
        }
        form={form}
        errors={errors}
        onClose={cerrarModal}
        onSave={guardar}
        onChange={handleChange}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div
          className={`text-2xl font-bold ${color}`}
        >
          {value}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
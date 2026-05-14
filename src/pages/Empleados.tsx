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
import { empleados as empleadosData } from '../data';
import type { Empleado, RolEmpleado } from '../types';
import {
  Plus,
  Phone,
  Mail,
  Pencil,
  UserX,
  UserCheck,
  Search,
  X,
  UserCog,
} from 'lucide-react';

const ROLES: RolEmpleado[] = [
  'Chapista',
  'Pintor',
  'Mecánico',
  'Administrativo',
];

const rolColors: Record<RolEmpleado, string> = {
  Chapista: 'bg-orange-100 text-orange-700',
  Pintor: 'bg-blue-100 text-blue-700',
  Mecánico: 'bg-purple-100 text-purple-700',
  Administrativo: 'bg-slate-100 text-slate-700',
};

interface FormData {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  rol: RolEmpleado;
  fechaIngreso: string;
}

const emptyForm: FormData = {
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  email: '',
  rol: 'Chapista',
  fechaIngreso: '',
};

export function Empleados() {
  const [lista, setLista] = useState<Empleado[]>(empleadosData);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState<RolEmpleado | 'Todos'>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<
    'Todos' | 'Activos' | 'Inactivos'
  >('Todos');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] =
    useState<Empleado | null>(null);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [confirmarDesactivar, setConfirmarDesactivar] =
    useState<Empleado | null>(null);

  // ==================== FILTRADO ====================
  const empleadosFiltrados = lista.filter((e) => {
    const texto = busqueda.toLowerCase();

    const coincideTexto =
      !busqueda ||
      e.nombre.toLowerCase().includes(texto) ||
      e.apellido.toLowerCase().includes(texto) ||
      e.dni.includes(texto) ||
      e.telefono.includes(texto) ||
      (e.email?.toLowerCase().includes(texto) ?? false);

    const coincideRol =
      filtroRol === 'Todos' || e.rol === filtroRol;

    const coincideEstado =
      filtroEstado === 'Todos' ||
      (filtroEstado === 'Activos'
        ? e.activo
        : !e.activo);

    return coincideTexto && coincideRol && coincideEstado;
  });

  // ==================== MODAL ====================
  const abrirModalNuevo = () => {
    setEmpleadoEditando(null);
    setForm(emptyForm);
    setErrors({});
    setModalAbierto(true);
  };

  const abrirModalEditar = (emp: Empleado) => {
    setEmpleadoEditando(emp);

    setForm({
      nombre: emp.nombre,
      apellido: emp.apellido,
      dni: emp.dni,
      telefono: emp.telefono,
      email: emp.email ?? '',
      rol: emp.rol,
      fechaIngreso: emp.fechaIngreso,
    });

    setErrors({});
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEmpleadoEditando(null);
  };

  // ==================== VALIDACIÓN ====================
  const validar = (): boolean => {
    const e: Partial<FormData> = {};

    if (!form.nombre.trim()) {
      e.nombre = 'El nombre es requerido.';
    }

    if (!form.apellido.trim()) {
      e.apellido = 'El apellido es requerido.';
    }

    if (!form.dni.trim()) {
      e.dni = 'El DNI es requerido.';
    }

    if (!form.telefono.trim()) {
      e.telefono = 'El teléfono es requerido.';
    }

    if (!form.fechaIngreso) {
      e.fechaIngreso = 'La fecha de ingreso es requerida.';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  // ==================== GUARDAR ====================
  const guardar = () => {
    if (!validar()) return;

    if (empleadoEditando) {
      setLista((prev) =>
        prev.map((e) =>
          e.id === empleadoEditando.id
            ? {
                ...e,
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                dni: form.dni.trim(),
                telefono: form.telefono.trim(),
                email: form.email.trim() || undefined,
                rol: form.rol,
                fechaIngreso: form.fechaIngreso,
              }
            : e
        )
      );
    } else {
      const nuevo: Empleado = {
        id: String(Date.now()),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim() || undefined,
        rol: form.rol,
        activo: true,
        fechaIngreso: form.fechaIngreso,
      };

      setLista((prev) => [...prev, nuevo]);
    }

    cerrarModal();
  };

  // ==================== ACTIVAR / DESACTIVAR ====================
  const toggleActivo = (emp: Empleado) => {
    if (emp.activo) {
      setConfirmarDesactivar(emp);
    } else {
      setLista((prev) =>
        prev.map((e) =>
          e.id === emp.id
            ? { ...e, activo: true }
            : e
        )
      );
    }
  };

  const confirmarDesactivacion = () => {
    if (!confirmarDesactivar) return;

    setLista((prev) =>
      prev.map((e) =>
        e.id === confirmarDesactivar.id
          ? { ...e, activo: false }
          : e
      )
    );

    setConfirmarDesactivar(null);
  };

  // ==================== STATS ====================
  const totalActivos = lista.filter((e) => e.activo).length;

  const totalInactivos = lista.filter((e) => !e.activo).length;

  return (
    <div className="space-y-6">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Empleados
          </h1>

          <p className="text-slate-600 mt-1">
            Gestión del personal del taller (
            {lista.length} registrados)
          </p>
        </div>

        <Button
          className="w-full lg:w-auto"
          onClick={abrirModalNuevo}
        >
          <Plus className="size-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          value={new Set(lista.map((e) => e.rol)).size}
          color="text-blue-600"
        />
      </div>

      {/* ==================== FILTROS ==================== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Buscar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar por nombre, DNI, email..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rol */}
            <select
              value={filtroRol}
              onChange={(e) =>
                setFiltroRol(
                  e.target.value as RolEmpleado | 'Todos'
                )
              }
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">
                Todos los roles
              </option>

              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Estado */}
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
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* ==================== TABLA ==================== */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>
                    Fecha Ingreso
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {empleadosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-slate-400"
                    >
                      No se encontraron empleados
                      con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  empleadosFiltrados.map((emp) => (
                    <TableRow
                      key={emp.id}
                      className={
                        !emp.activo
                          ? 'opacity-60 bg-slate-50'
                          : ''
                      }
                    >
                      {/* EMPLEADO */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                            ${
                              emp.activo
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {emp.nombre[0]}
                            {emp.apellido[0]}
                          </div>

                          <div>
                            <div className="font-semibold text-slate-900">
                              {emp.nombre}{' '}
                              {emp.apellido}
                            </div>

                            <div className="text-xs text-slate-400">
                              #{emp.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* DNI */}
                      <TableCell className="font-mono text-slate-600">
                        {emp.dni}
                      </TableCell>

                      {/* CONTACTO */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-slate-600 text-sm">
                            <Phone className="size-3.5 shrink-0" />
                            {emp.telefono}
                          </div>

                          {emp.email && (
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <Mail className="size-3.5 shrink-0" />
                              {emp.email}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* ROL */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${rolColors[emp.rol]}`}
                        >
                          <UserCog className="size-3" />
                          {emp.rol}
                        </span>
                      </TableCell>

                      {/* FECHA */}
                      <TableCell className="text-slate-600 text-sm">
                        {new Date(
                          emp.fechaIngreso +
                            'T00:00:00'
                        ).toLocaleDateString(
                          'es-AR',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        )}
                      </TableCell>

                      {/* ESTADO */}
                      <TableCell>
                        {emp.activo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            <span className="size-1.5 rounded-full bg-red-400 inline-block" />
                            Inactivo
                          </span>
                        )}
                      </TableCell>

                      {/* ACCIONES */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              abrirModalEditar(emp)
                            }
                            title="Editar"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            onClick={() =>
                              toggleActivo(emp)
                            }
                            title={
                              emp.activo
                                ? 'Desactivar'
                                : 'Reactivar'
                            }
                            className={`p-1.5 rounded-lg transition-colors ${
                              emp.activo
                                ? 'hover:bg-red-50 text-slate-500 hover:text-red-600'
                                : 'hover:bg-emerald-50 text-slate-500 hover:text-emerald-600'
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ==================== MODAL ==================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {empleadoEditando
                    ? 'Editar Empleado'
                    : 'Nuevo Empleado'}
                </h2>

                <p className="text-sm text-slate-500 mt-0.5">
                  {empleadoEditando
                    ? `Modificando datos de ${empleadoEditando.nombre} ${empleadoEditando.apellido}`
                    : 'Complete los datos del nuevo empleado'}
                </p>
              </div>

              <button
                onClick={cerrarModal}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Nombre *"
                  error={errors.nombre}
                >
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nombre: e.target.value,
                      })
                    }
                    className={inputClass(
                      !!errors.nombre
                    )}
                  />
                </FormField>

                <FormField
                  label="Apellido *"
                  error={errors.apellido}
                >
                  <input
                    type="text"
                    value={form.apellido}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        apellido: e.target.value,
                      })
                    }
                    className={inputClass(
                      !!errors.apellido
                    )}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="DNI *"
                  error={errors.dni}
                >
                  <input
                    type="text"
                    value={form.dni}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dni: e.target.value,
                      })
                    }
                    className={inputClass(
                      !!errors.dni
                    )}
                  />
                </FormField>

                <FormField label="Rol *">
                  <select
                    value={form.rol}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rol: e.target
                          .value as RolEmpleado,
                      })
                    }
                    className={inputClass(false)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField
                label="Teléfono *"
                error={errors.telefono}
              >
                <input
                  type="text"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefono: e.target.value,
                    })
                  }
                  className={inputClass(
                    !!errors.telefono
                  )}
                />
              </FormField>

              <FormField label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className={inputClass(false)}
                />
              </FormField>

              <FormField
                label="Fecha de Ingreso *"
                error={errors.fechaIngreso}
              >
                <input
                  type="date"
                  value={form.fechaIngreso}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fechaIngreso:
                        e.target.value,
                    })
                  }
                  className={inputClass(
                    !!errors.fechaIngreso
                  )}
                />
              </FormField>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={cerrarModal}
              >
                Cancelar
              </Button>

              <Button onClick={guardar}>
                {empleadoEditando
                  ? 'Guardar Cambios'
                  : 'Agregar Empleado'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL DESACTIVAR ==================== */}
      {confirmarDesactivar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <UserX className="size-6 text-red-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Desactivar Empleado
                </h3>

                <p className="text-sm text-slate-500 mt-0.5">
                  ¿Estás seguro que deseas
                  desactivar a{' '}
                  <span className="font-semibold text-slate-700">
                    {confirmarDesactivar.nombre}{' '}
                    {
                      confirmarDesactivar.apellido
                    }
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmarDesactivar(null)
                }
              >
                Cancelar
              </Button>

              <Button
                onClick={confirmarDesactivacion}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Desactivar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== HELPERS ====================
function inputClass(hasError: boolean) {
  return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? 'border-red-400 focus:ring-red-300'
      : 'border-slate-200 focus:ring-blue-500'
  }`;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
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
        <div className={`text-2xl font-bold ${color}`}>
          {value}
        </div>

        <div className="text-xs text-slate-500 mt-1">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
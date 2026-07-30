import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

import type {
  CreateEmpleadoDto,
  Empleado,
  RolEmpleado,
  UpdateEmpleadoDto,
} from "../types";

import { Plus, UserX, UserCheck, Briefcase, HardHat } from "lucide-react";

import { useEmpleados } from "@/hooks/useEmpleados";

import { EmpleadoModal } from "@/components/modals/ModalEmpleado";
import { EmpleadoAccesoModal } from "@/components/modals/ModalAccesoEmpleado";

import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/StatsGrid";
import { StatCard } from "@/components/common/StatCard";
import { DataFilters } from "@/components/common/DataFilters";
import { DataTable } from "@/components/common/DataTable";

import { ROLES_EMPLEADO } from "../types";
import { createEmpleadoColumns } from "@/components/empleados/EmpleadoColumns";
import { crearAccesoEmpleado } from "@/services/empleadoAccessService";
import { sileo } from "sileo";

const FORM_VACIO: CreateEmpleadoDto = {
  nombre: "",
  apellido: "",
  dni: "",
  telefono: "",
  cargo: "Chapista",
};

const SORT_OPTIONS = [
  { value: "nombre", label: "Nombre A–Z" },
  { value: "fecha", label: "Más recientes" },
];

const FILTER_GROUPS = [
  {
    id: "rol",
    options: [
      { value: "Todos", label: "Todos" },
      ...ROLES_EMPLEADO.map((rol) => ({
        value: rol,
        label: rol,
      })),
    ],
  },
  {
    id: "estado",
    options: [
      { value: "Todos", label: "Todos" },
      { value: "Activos", label: "Activos" },
      { value: "Inactivos", label: "Inactivos" },
    ],
  },
];

type FormErrors = Partial<Record<keyof CreateEmpleadoDto, string>>;

export function Empleados() {
  const {
    empleados: lista,
    loading,
    error,
    fetchEmpleados,
    addEmpleado,
    editEmpleado,
    toggleActivo,
  } = useEmpleados();

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<RolEmpleado | "Todos">("Todos");
  const [filtroEstado, setFiltroEstado] = useState<
    "Todos" | "Activos" | "Inactivos"
  >("Todos");

  const [sortBy, setSortBy] = useState("nombre");

  const [modalAbierto, setModalAbierto] = useState(false);

  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(
    null,
  );

  const [confirmarDesactivar, setConfirmarDesactivar] =
    useState<Empleado | null>(null);

  // Modal acceso
  const [modalAccesoAbierto, setModalAccesoAbierto] = useState(false);

  const [empleadoAcceso, setEmpleadoAcceso] = useState<Empleado | null>(null);

  const [emailAcceso, setEmailAcceso] = useState("");

  const [isAdminAcceso, setIsAdminAcceso] = useState(false);

  const [creandoAcceso, setCreandoAcceso] = useState(false);

  const [form, setForm] = useState<CreateEmpleadoDto>(FORM_VACIO);

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [guardando, setGuardando] = useState(false);

  const empleadosFiltrados = [...lista]
    .filter((e) => {
      const texto = busqueda.toLowerCase();

      const coincideTexto =
        !busqueda ||
        e.nombre.toLowerCase().includes(texto) ||
        e.apellido.toLowerCase().includes(texto) ||
        e.dni.includes(texto) ||
        e.telefono.includes(texto) ||
        (e.email?.toLowerCase().includes(texto) ?? false);

      const coincideRol = filtroRol === "Todos" || e.cargo === filtroRol;

      const coincideEstado =
        filtroEstado === "Todos" ||
        (filtroEstado === "Activos" ? e.activo : !e.activo);

      return coincideTexto && coincideRol && coincideEstado;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "fecha":
          return (
            new Date(b.fecha_ingreso).getTime() -
            new Date(a.fecha_ingreso).getTime()
          );

        case "nombre":
        default:
          return `${a.apellido} ${a.nombre}`.localeCompare(
            `${b.apellido} ${b.nombre}`,
          );
      }
    });

  const abrirModalNuevo = () => {
    setEmpleadoEditando(null);
    setForm(FORM_VACIO);
    setFormErrors({});
    setModalAbierto(true);
  };

  const abrirModalEditar = (empleado: Empleado) => {
    setEmpleadoEditando(empleado);

    setForm({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      dni: empleado.dni,
      telefono: empleado.telefono,
      cargo: empleado.cargo,
    });

    setFormErrors({});
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setEmpleadoEditando(null);
    setForm(FORM_VACIO);
    setFormErrors({});
    setModalAbierto(false);
  };

  const handleChange = (field: keyof CreateEmpleadoDto, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "cargo" ? (value as RolEmpleado) : value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validar = (): boolean => {
    const nuevosErrores: FormErrors = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";

    if (!form.apellido.trim())
      nuevosErrores.apellido = "El apellido es obligatorio";

    if (!form.dni.trim()) nuevosErrores.dni = "El DNI es obligatorio";

    if (!form.telefono.trim())
      nuevosErrores.telefono = "El teléfono es obligatorio";

    setFormErrors(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarEmpleado = async () => {
  if (!validar()) return;

  try {
    setGuardando(true);

    if (empleadoEditando) {
      const update: UpdateEmpleadoDto = {
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        telefono: form.telefono,
        cargo: form.cargo,
      };

      await editEmpleado(empleadoEditando.id, update);

      sileo.success({
        title: "Empleado actualizado",
        description: "Los datos del empleado fueron modificados correctamente.",
      });
    } else {
      await addEmpleado(form);

      sileo.success({
        title: "Empleado creado",
        description: "El empleado fue agregado correctamente.",
      });
    }

    cerrarModal();
  } catch (err) {
    console.error(err);

    sileo.error({
      title: "Error",
      description: "No se pudo guardar el empleado.",
    });
  } finally {
    setGuardando(false);
  }
};

  const handleDarAcceso = (empleado: Empleado) => {
    setEmpleadoAcceso(empleado);

    setEmailAcceso(empleado.email ?? "");

    setIsAdminAcceso(false);

    setModalAccesoAbierto(true);
  };

  const cerrarModalAcceso = () => {
    setModalAccesoAbierto(false);

    setEmpleadoAcceso(null);

    setEmailAcceso("");

    setIsAdminAcceso(false);
  };

  const confirmarAcceso = async () => {
  if (!empleadoAcceso) return;

  if (!emailAcceso.trim()) {
    sileo.error({
      title: "Email requerido",
      description: "Ingresá un email para crear el acceso.",
    });

    return;
  }

  try {
    setCreandoAcceso(true);

    await crearAccesoEmpleado({
      empleado_id: empleadoAcceso.id,
      email: emailAcceso.trim(),
      is_admin: isAdminAcceso,
    });

    await fetchEmpleados();

    sileo.success({
      title: "Acceso creado",
      description: "El usuario podrá ingresar al sistema.",
    });

    cerrarModalAcceso();

  } catch (error) {
    console.error("Error creando acceso:", error);

    sileo.error({
      title: "Error creando acceso",
      description: "No se pudo generar el acceso del empleado.",
    });

  } finally {
    setCreandoAcceso(false);
  }
};

  const handleToggleActivo = async (emp: Empleado) => {
  if (emp.activo) {
    setConfirmarDesactivar(emp);
    return;
  }

  try {
    await toggleActivo(emp.id, true);

    sileo.success({
      title: "Empleado activado",
      description: "El empleado volvió a estar activo.",
    });

  } catch (error) {
    console.error(error);

    sileo.error({
      title: "Error",
      description: "No se pudo activar el empleado.",
    });
  }
};

  const confirmarDesactivacion = async () => {
  if (!confirmarDesactivar) return;

  try {
    await toggleActivo(confirmarDesactivar.id, false);

    sileo.success({
      title: "Empleado desactivado",
      description: "El empleado fue marcado como inactivo.",
    });

    setConfirmarDesactivar(null);

  } catch (error) {
    console.error(error);

    sileo.error({
      title: "Error",
      description: "No se pudo desactivar el empleado.",
    });
  }
};

  const totalActivos = lista.filter((e) => e.activo).length;
  const totalInactivos = lista.filter((e) => !e.activo).length;

  const empleadosEsteMes = useMemo(() => {
  const ahora = new Date();

  return lista.filter((empleado) => {
    const fecha = new Date(empleado.fecha_ingreso);

    return (
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    );
  }).length;
}, [lista]);

const totalRoles = new Set(
  lista.map((empleado) => empleado.cargo),
).size;

  const columns = useMemo(
    () =>
      createEmpleadoColumns({
        onEditar: abrirModalEditar,
        onToggleActivo: handleToggleActivo,
        onDarAcceso: handleDarAcceso,
      }),
    [abrirModalEditar, handleToggleActivo, handleDarAcceso],
  );

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empleados"
        description="Gestión del personal del taller"
        actions={
          <Button onClick={abrirModalNuevo}>
            <Plus className="mr-2 size-4" />
            Nuevo Empleado
          </Button>
        }
      />

      <StatsGrid>
  <StatCard
    label="Total"
    value={lista.length}
    icon={<Briefcase className="size-5" />}
    iconClass="bg-teal-100 text-teal-700"
    footer={`${empleadosEsteMes} ingresados este mes`}
  />

  <StatCard
    label="Activos"
    value={totalActivos}
    icon={<UserCheck className="size-5" />}
    iconClass="bg-green-100 text-green-700"
    footer={`${Math.round(
      lista.length > 0
        ? (totalActivos / lista.length) * 100
        : 0,
    )}% del personal activo`}
  />

  <StatCard
    label="Inactivos"
    value={totalInactivos}
    icon={<UserX className="size-5" />}
    iconClass="bg-red-100 text-red-700"
    footer="Empleados deshabilitados"
    trend="neutral"
  />

  <StatCard
    label="Roles"
    value={totalRoles}
    icon={<HardHat className="size-5" />}
    iconClass="bg-blue-100 text-blue-700"
    footer="Tipos de cargo disponibles"
  />
</StatsGrid>

      <Card>
        <CardContent className="p-4">
          <DataFilters
            searchValue={busqueda}
            onSearchChange={setBusqueda}
            searchPlaceholder="Buscar por nombre, DNI o teléfono..."
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
            filterGroups={FILTER_GROUPS}
            activeFilters={{
              rol: filtroRol,
              estado: filtroEstado,
            }}
            onFilterChange={(groupId, value) => {
              if (groupId === "rol") {
                setFiltroRol(value as RolEmpleado | "Todos");
              }

              if (groupId === "estado") {
                setFiltroEstado(value as "Todos" | "Activos" | "Inactivos");
              }
            }}
          />
        </CardContent>
      </Card>

      <DataTable
        data={empleadosFiltrados}
        columns={columns}
        getRowKey={(empleado) => empleado.id}
        loading={loading}
        headerColorClass="text-teal-600"
        emptyTitle="No se encontraron empleados"
        emptyDescription="Probá modificando los filtros de búsqueda."
        emptyIcon={<Briefcase className="size-14 text-slate-300" />}
      />

      <EmpleadoModal
        open={modalAbierto}
        loading={guardando}
        form={form}
        errors={formErrors}
        onClose={cerrarModal}
        onSave={guardarEmpleado}
        onChange={handleChange}
      />

      <EmpleadoAccesoModal
        open={modalAccesoAbierto}
        loading={creandoAcceso}
        empleado={empleadoAcceso}
        email={emailAcceso}
        isAdmin={isAdminAcceso}
        onEmailChange={setEmailAcceso}
        onIsAdminChange={setIsAdminAcceso}
        onClose={cerrarModalAcceso}
        onConfirm={confirmarAcceso}
      />

      {confirmarDesactivar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-sm">
            <CardContent className="space-y-4 p-6">
              <p className="text-slate-800">
                ¿Desactivar a{" "}
                <strong>
                  {confirmarDesactivar.nombre} {confirmarDesactivar.apellido}
                </strong>
                ?
              </p>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmarDesactivar(null)}
                >
                  Cancelar
                </Button>

                <Button variant="destructive" onClick={confirmarDesactivacion}>
                  Desactivar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

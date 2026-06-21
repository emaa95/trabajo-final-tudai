// src/hooks/useEmpleados.ts
import { useEmpleadoStore } from "@/store/empleadoStore";

export function useEmpleados() {
  const empleados = useEmpleadoStore((s) => s.empleados);
  const empleadoSeleccionado = useEmpleadoStore((s) => s.empleadoSeleccionado);
  const loading = useEmpleadoStore((s) => s.loading);
  const error = useEmpleadoStore((s) => s.error);

  const fetchEmpleados = useEmpleadoStore((s) => s.fetchEmpleados);
  const setEmpleadoSeleccionado = useEmpleadoStore(
    (s) => s.setEmpleadoSeleccionado
  );
  const clearError = useEmpleadoStore((s) => s.clearError);

  const addEmpleado = useEmpleadoStore((s) => s.addEmpleado);
  const editEmpleado = useEmpleadoStore((s) => s.editEmpleado);
  const toggleActivo = useEmpleadoStore((s) => s.toggleActivo);

  return {
    empleados,
    empleadoSeleccionado,
    loading,
    error,

    fetchEmpleados,
    setEmpleadoSeleccionado,
    clearError,

    addEmpleado,
    editEmpleado,
    toggleActivo,
  };
}
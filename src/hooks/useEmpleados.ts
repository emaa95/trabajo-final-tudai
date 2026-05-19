import { useEffect, useState } from 'react';

import type { Empleado } from '@/types';

import {
  getEmpleados,
  crearEmpleado as crearEmpleadoService,
  actualizarEmpleado as actualizarEmpleadoService,
} from '@/services/empleadosService';

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<
    Empleado[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  async function cargarEmpleados() {
    try {
      setLoading(true);

      const data = await getEmpleados();

      setEmpleados(data);
    } catch (err) {
      console.error(err);

      setError(
        'Error cargando empleados'
      );
    } finally {
      setLoading(false);
    }
  }

  async function crearEmpleado(
    payload: Omit<Empleado, 'id'>
  ) {
    const nuevo =
      await crearEmpleadoService(payload);

    setEmpleados((prev) => [
      ...prev,
      nuevo,
    ]);

    return nuevo;
  }

  async function actualizarEmpleado(
    id: string,
    payload: Partial<Empleado>
  ) {
    const actualizado =
      await actualizarEmpleadoService(
        id,
        payload
      );

    setEmpleados((prev) =>
      prev.map((e) =>
        e.id === id ? actualizado : e
      )
    );

    return actualizado;
  }

  async function toggleEmpleadoActivo(
    id: string,
    activo: boolean
  ) {
    const actualizado =
      await actualizarEmpleadoService(
        id,
        { activo }
      );

    setEmpleados((prev) =>
      prev.map((e) =>
        e.id === id ? actualizado : e
      )
    );

    return actualizado;
  }

  return {
    empleados,

    loading,
    error,

    crearEmpleado,
    actualizarEmpleado,
    toggleEmpleadoActivo,

    reload: cargarEmpleados,
  };
}
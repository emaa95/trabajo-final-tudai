import { create } from 'zustand';

import type { Empleado, RolEmpleado } from '@/types';

import {
  getEmpleados,
  crearEmpleado,
  actualizarEmpleado,
} from '@/services/empleadosService';

interface EmpleadoStore {
  empleados: Empleado[];

  empleadoSeleccionado: Empleado | null;

  loading: boolean;

  error: string | null;

  // =========================
  // FETCH ALL
  // =========================
  fetchEmpleados: () => Promise<void>;

  // =========================
  // CREATE
  // =========================
  addEmpleado: (payload: {
    auth_user_id?: string | null;
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    cargo: RolEmpleado;
    taller_id?: string | null;
  }) => Promise<void>;

  // =========================
  // UPDATE
  // =========================
  editEmpleado: (
    id: string,
    payload: Partial<Empleado>
  ) => Promise<Empleado>;

  // =========================
  // TOGGLE ACTIVO
  // =========================
  toggleActivo: (id: string, activo: boolean) => Promise<void>;

  // =========================
  // SELECT
  // =========================
  setEmpleadoSeleccionado: (empleado: Empleado | null) => void;

  clearError: () => void;
}

export const useEmpleadoStore = create<EmpleadoStore>((set) => ({
  empleados: [],

  empleadoSeleccionado: null,

  loading: false,

  error: null,

  // =========================
  // FETCH ALL
  // =========================
  fetchEmpleados: async () => {
    try {
      set({ loading: true, error: null });

      const empleados = await getEmpleados();

      set({
        empleados,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Error al obtener empleados',
        loading: false,
      });
    }
  },

  // =========================
  // CREATE
  // =========================
  addEmpleado: async (payload) => {
    try {
      set({ loading: true, error: null });

      const empleado = await crearEmpleado(payload);

      set((state) => ({
        empleados: [empleado, ...state.empleados],
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Error al crear empleado',
        loading: false,
      });

      throw error;
    }
  },

  // =========================
  // UPDATE
  // =========================
  editEmpleado: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const data = await actualizarEmpleado(id, payload);

      set((state) => ({
        empleados: state.empleados.map((e) =>
          e.id === id ? data : e
        ),

        empleadoSeleccionado:
          state.empleadoSeleccionado?.id === id
            ? data
            : state.empleadoSeleccionado,

        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Error al actualizar empleado',
        loading: false,
      });

      throw error;
    }
  },

  // =========================
  // TOGGLE ACTIVO
  // =========================
  toggleActivo: async (id, activo) => {
    try {
      const data = await actualizarEmpleado(id, {
        activo,
      });

      set((state) => ({
        empleados: state.empleados.map((e) =>
          e.id === id ? data : e
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Error al cambiar estado',
      });

      throw error;
    }
  },

  // =========================
  // SELECT
  // =========================
  setEmpleadoSeleccionado: (empleado) => {
    set({ empleadoSeleccionado: empleado });
  },

  // =========================
  // CLEAR ERROR
  // =========================
  clearError: () => {
    set({ error: null });
  },
}));
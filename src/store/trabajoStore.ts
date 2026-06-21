import { create } from "zustand";

import {
  getTrabajos,
  getTrabajoById,
  createTrabajoService,
  updateTrabajoService,
} from "@/services/trabajoService";

import type {
  Trabajo,
  TrabajoDetalle,
  CreateTrabajoPayload,
} from "@/types";

interface TrabajoStore {
  trabajos: TrabajoDetalle[];
  trabajoSeleccionado: TrabajoDetalle | null;
  loading: boolean;
  error: string | null;

  fetchTrabajos: () => Promise<void>;
  fetchTrabajoById: (id: string) => Promise<void>;
  addTrabajo: (payload: CreateTrabajoPayload) => Promise<Trabajo>;
  updateTrabajo: (id: string, payload: Partial<Trabajo>) => Promise<Trabajo>;
  setTrabajoSeleccionado: (trabajo: TrabajoDetalle | null) => void;
  clearError: () => void;
}

export const trabajoStore = create<TrabajoStore>((set) => ({
  trabajos: [],
  trabajoSeleccionado: null,
  loading: false,
  error: null,

  // =========================
  // LISTADO
  // =========================
  async fetchTrabajos() {
    set({ loading: true, error: null });

    try {
      const trabajos = await getTrabajos();

      set({
        trabajos,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al obtener trabajos",
      });
    }
  },

  // =========================
  // DETALLE
  // =========================
  async fetchTrabajoById(id) {
  console.log("1 - START", id);

  set({ loading: true, trabajoSeleccionado: null });

  try {
    const trabajo = await getTrabajoById(id);

    console.log("2 - RESULT", trabajo);

    set({
      trabajoSeleccionado: trabajo,
      loading: false,
    });

    console.log("3 - END SUCCESS");
  } catch (error) {
    console.log("4 - ERROR", error);
    const message =
        error instanceof Error
          ? error.message
          : "Error al crear trabajo";
    set({
      loading: false,
      error: message      
    });
  }

  console.log("5 - AFTER TRY/CATCH");
},

  // =========================
  // CREAR
  // =========================
  async addTrabajo(payload) {
    set({ loading: true, error: null });

    try {
      const trabajo = await createTrabajoService(payload);

      set((state) => ({
        trabajos: [trabajo, ...state.trabajos],
        loading: false,
      }));

      return trabajo;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al crear trabajo";

      set({
        error: message,
        loading: false,
      });

      throw error;
    }
  },

  // =========================
  // UPDATE
  // =========================
  async updateTrabajo(id, payload) {
    set({ loading: true, error: null });

    try {
      const trabajo = await updateTrabajoService(id, payload);

      set((state) => ({
        trabajos: state.trabajos.map((t) =>
          t.id === trabajo.id ? { ...t, ...trabajo } : t
        ),
        trabajoSeleccionado:
          state.trabajoSeleccionado?.id === trabajo.id
            ? { ...state.trabajoSeleccionado, ...trabajo }
            : state.trabajoSeleccionado,
        loading: false,
      }));

      return trabajo;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al actualizar trabajo";

      set({
        error: message,
        loading: false,
      });

      throw error;
    }
  },

  // =========================
  // UTIL
  // =========================
  setTrabajoSeleccionado(trabajo) {
    set({ trabajoSeleccionado: trabajo });
  },

  clearError() {
    set({ error: null });
  },
}));
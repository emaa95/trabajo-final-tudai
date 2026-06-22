import { create } from 'zustand';

import type { Aseguradora } from '@/types';

import {
  getAseguradorasService,
  getAseguradoraByIdService,
  createAseguradoraService,
  updateAseguradoraService,
  deleteAseguradoraService,
} from '@/services/aseguradoraService';

interface AseguradoraStore {
  aseguradoras: Aseguradora[];

  aseguradoraSeleccionada: Aseguradora | null;

  loading: boolean;

  error: string | null;

  fetchAseguradoras: () => Promise<void>;

  fetchAseguradoraById: (id: string) => Promise<void>;

  addAseguradora: (payload: {
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    cuit?: string;
  }) => Promise<void>;

  editAseguradora: (
    id: string,
    payload: Partial<Aseguradora>
  ) => Promise<Aseguradora>;

  deleteAseguradora: (id: string) => Promise<void>;
  
  setAseguradoraSeleccionada: (
    aseguradora: Aseguradora | null
  ) => void;

  clearError: () => void;
}

export const aseguradoraStore = create<AseguradoraStore>((set) => ({
  aseguradoras: [],

  aseguradoraSeleccionada: null,

  loading: false,

  error: null,

  // =========================
  // FETCH ALL
  // =========================

  fetchAseguradoras: async () => {
    try {
      set({ loading: true, error: null });

      const data = await getAseguradorasService();

      set({
        aseguradoras: data ?? [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al obtener aseguradoras',
        loading: false,
      });
    }
  },

  // =========================
  // FETCH BY ID
  // =========================

  fetchAseguradoraById: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const data = await getAseguradoraByIdService(id);

      set({
        aseguradoraSeleccionada: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al obtener aseguradora',
        loading: false,
      });
    }
  },

  // =========================
  // CREATE
  // =========================

  addAseguradora: async (payload) => {
    try {
      set({ loading: true, error: null });

      const created = await createAseguradoraService(payload);

      set((state) => ({
        aseguradoras: [created, ...state.aseguradoras],
        loading: false,
      }));
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al crear aseguradora';

      set({
        error: mensaje,
        loading: false,
      });

      throw error;
    }
  },

  // =========================
  // UPDATE
  // =========================

  editAseguradora: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const updated = await updateAseguradoraService(id, payload);

      set((state) => ({
        aseguradoras: state.aseguradoras.map((a) =>
          a.id === id ? updated : a
        ),

        aseguradoraSeleccionada:
          state.aseguradoraSeleccionada?.id === id
            ? updated
            : state.aseguradoraSeleccionada,

        loading: false,
      }));

      return updated;
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al actualizar aseguradora';

      set({
        error: mensaje,
        loading: false,
      });

      throw error;
    }
  },

  deleteAseguradora: async (id: string) => {
  try {
    set({ loading: true, error: null });

    await deleteAseguradoraService(id);

    set((state) => ({
      aseguradoras: state.aseguradoras.filter(
        (a) => a.id !== id
      ),

      aseguradoraSeleccionada:
        state.aseguradoraSeleccionada?.id === id
          ? null
          : state.aseguradoraSeleccionada,

      loading: false,
    }));
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : 'Error al eliminar aseguradora';

    set({
      error: mensaje,
      loading: false,
    });

    throw error;
  }
},


  // =========================
  // SELECT
  // =========================

  setAseguradoraSeleccionada: (aseguradora) => {
    set({ aseguradoraSeleccionada: aseguradora });
  },

  
  // =========================
  // CLEAR ERROR
  // =========================

  clearError: () => {
    set({ error: null });
  },
}));
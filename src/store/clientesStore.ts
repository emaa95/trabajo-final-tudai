import { create } from 'zustand';

import type {
  Cliente,
  CreateClienteDto,
  UpdateClienteDto,
} from '@/types';

import {
  getClientes,
  getClienteById,
  crearCliente,
  actualizarCliente,
} from '@/services/clienteService';

interface ClienteStore {
  clientes: Cliente[];
  clienteSeleccionado: Cliente | null;
  loading: boolean;
  error: string | null;

  fetchClientes: () => Promise<void>;
  fetchClienteById: (id: string) => Promise<void>;
  addCliente: (payload: CreateClienteDto) => Promise<Cliente>;
  editCliente: (id: string, payload: UpdateClienteDto) => Promise<Cliente>;
  setClienteSeleccionado: (cliente: Cliente | null) => void;
  clearError: () => void;
  resetLoading: () => void;
}

export const clienteStore = create<ClienteStore>((set) => ({
  clientes: [],
  clienteSeleccionado: null,
  loading: false,
  error: null,

  resetLoading: () => {
    set({ loading: false, error: null });
  },

  fetchClientes: async () => {
    try {
      set({ loading: true, error: null });

      const clientes = await getClientes();

      set({ clientes, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Error al obtener clientes',
        loading: false,
      });
    }
  },

  fetchClienteById: async (id) => {
    try {
      set({ loading: true, error: null });

      const cliente = await getClienteById(id);

      set({ clienteSeleccionado: cliente, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Error al obtener cliente',
        loading: false,
      });
    }
  },

  addCliente: async (payload) => {
    try {
      set({ loading: true, error: null });

      const cliente = await crearCliente(payload);

      set((state) => ({
        clientes: [...state.clientes, cliente],
        loading: false,
      }));

      return cliente;
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al crear cliente';

      set({ error: mensaje, loading: false });

      throw error;
    }
  },

  editCliente: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const clienteActualizado = await actualizarCliente(id, payload);

      set((state) => ({
        clientes: state.clientes.map((c) =>
          c.id === id ? clienteActualizado : c
        ),
        clienteSeleccionado:
          state.clienteSeleccionado?.id === id
            ? clienteActualizado
            : state.clienteSeleccionado,
        loading: false,
      }));

      return clienteActualizado;
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al actualizar cliente';

      set({ error: mensaje, loading: false });

      throw error;
    }
  },

  setClienteSeleccionado: (cliente) => {
    set({ clienteSeleccionado: cliente });
  },

  clearError: () => {
    set({ error: null });
  },
}));
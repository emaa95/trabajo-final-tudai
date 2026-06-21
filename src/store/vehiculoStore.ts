// src/store/vehiculoStore.ts
import { create } from "zustand";
import type { Vehiculo } from "@/types";

import {
  getVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  getVehiculosByCliente,
} from "@/services/vehiculoService";

type VehiculosState = {
  vehiculos: Vehiculo[];
  vehiculosByCliente: Vehiculo[];
  loading: boolean;

  fetchVehiculos: () => Promise<void>;
  fetchVehiculosByCliente: (clienteId: string) => Promise<void>;
  clearVehiculosByCliente: () => void;

  addVehiculo: (data: any) => Promise<void>;
  editVehiculo: (id: string, data: any) => Promise<void>;
  removeVehiculo: (id: string) => Promise<void>;
};

export const vehiculosStore = create<VehiculosState>((set, get) => ({
  vehiculos: [],
  vehiculosByCliente: [],
  loading: false,

  fetchVehiculos: async () => {
    set({ loading: true });
    const data = await getVehiculos();
    set({ vehiculos: data, loading: false });
  },

  fetchVehiculosByCliente: async (clienteId: string) => {
    set({ loading: true });
    const data = await getVehiculosByCliente(clienteId);

    set({
      vehiculosByCliente: data,
      loading: false,
    });
  },

  clearVehiculosByCliente: () =>
    set({
      vehiculosByCliente: [],
    }),

  addVehiculo: async (data) => {
    await crearVehiculo(data);
    await get().fetchVehiculos();
  },

  editVehiculo: async (id, data) => {
    await actualizarVehiculo(id, data);
    await get().fetchVehiculos();
  },

  removeVehiculo: async (id) => {
    await eliminarVehiculo(id);
    await get().fetchVehiculos();
  },
}));
import { create } from "zustand";

import type {
  Vehiculo,
  CreateVehiculoDto,
  UpdateVehiculoDto,
} from "@/types";

import {
  getVehiculos,
  getVehiculoById,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  getVehiculosByCliente,
} from "@/services/vehiculoService";


type VehiculosState = {
  vehiculos: Vehiculo[];

  vehiculosByCliente: Vehiculo[];

  vehiculoSeleccionado: Vehiculo | null;

  loading: boolean;

  error: string | null;


  fetchVehiculos: () => Promise<void>;

  fetchVehiculoById: (
    id: string
  ) => Promise<void>;

  fetchVehiculosByCliente: (
    clienteId: string
  ) => Promise<void>;


  clearVehiculoSeleccionado: () => void;

  clearVehiculosByCliente: () => void;


  addVehiculo: (
    data: CreateVehiculoDto
  ) => Promise<Vehiculo>;

  editVehiculo: (
    id: string,
    data: UpdateVehiculoDto
  ) => Promise<void>;

  removeVehiculo: (
    id: string
  ) => Promise<void>;
};



export const vehiculosStore = create<VehiculosState>((set, get) => ({

  vehiculos: [],

  vehiculosByCliente: [],

  vehiculoSeleccionado: null,

  loading: false,

  error: null,


  fetchVehiculos: async () => {

    set({
      loading: true,
      error: null,
    });


    try {

      const data = await getVehiculos();

      set({
        vehiculos: data,
        loading: false,
      });


    } catch {

      set({
        error: "Error al obtener los vehículos",
        loading: false,
      });

    }

  },


  fetchVehiculoById: async (id) => {

    set({
      loading: true,
      error: null,
    });


    try {

      const data = await getVehiculoById(id);


      set({
        vehiculoSeleccionado: data,
        loading: false,
      });


    } catch {

      set({
        error: "Error al obtener el vehículo",
        loading: false,
      });

    }

  },


  fetchVehiculosByCliente: async (clienteId) => {

    set({
      loading: true,
      error: null,
    });


    try {

      const data = await getVehiculosByCliente(clienteId);


      set({
        vehiculosByCliente: data,
        loading: false,
      });


    } catch {

      set({
        error: "Error al obtener vehículos del cliente",
        loading: false,
      });

    }

  },


  clearVehiculoSeleccionado: () =>
    set({
      vehiculoSeleccionado: null,
    }),


  clearVehiculosByCliente: () =>
    set({
      vehiculosByCliente: [],
    }),


  addVehiculo: async (data) => {

    const vehiculo = await crearVehiculo(data);

    await get().fetchVehiculos();

    return vehiculo;

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
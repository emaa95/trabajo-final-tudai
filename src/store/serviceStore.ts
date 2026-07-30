import { create } from "zustand";

import type {
  ServiceDetalle,
  CreateServicioDto,
  UpdateServicioDto,
  ServiceRepuesto,
  CreateServiceRepuestoDto,
  UpdateServiceRepuestoDto,
  EstadoTrabajo,
} from "@/types";

import {
  getServicesService,
  getServiceByIdService,
  getServiceByTrabajoIdService,
  createServiceService,
  updateServiceService,
} from "@/services/serviceService";

import {
  createServiceRepuestoService,
  updateServiceRepuestoService,
  deleteServiceRepuestoService,
} from "@/services/serviceRepuestosService";

interface ServiceStore {
  services: ServiceDetalle[];

  serviceSeleccionado: ServiceDetalle | null;

  loading: boolean;

  error: string | null;

  fetchServices: () => Promise<void>;

  getServiceByIdService: (
    id: string
  ) => Promise<void>;

  getServiceByTrabajoIdService: (
    trabajoId: string
  ) => Promise<void>;

  createServiceService: (
    payload: CreateServicioDto
  ) => Promise<ServiceDetalle>;

  updateServiceService: (
    id: string,
    payload: UpdateServicioDto
  ) => Promise<ServiceDetalle>;

  addRepuestoService: (
    payload: CreateServiceRepuestoDto
  ) => Promise<ServiceRepuesto>;

  updateRepuestoService: (
    id: string,
    payload: UpdateServiceRepuestoDto
  ) => Promise<ServiceRepuesto>;

  deleteRepuestoService: (
    id: string,
    estadoTrabajo: EstadoTrabajo
  ) => Promise<void>;

  setServiceSeleccionado: (
    service: ServiceDetalle | null
  ) => void;

  clearError: () => void;
}

export const serviceStore =
  create<ServiceStore>((set) => ({

    services: [],

    serviceSeleccionado: null,

    loading: false,

    error: null,

    // =========================
    // GET ALL
    // =========================

    fetchServices: async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const services =
          await getServicesService();
        console.log(services);
        set({
          services,
          loading: false,
        });

      } catch (error) {

        set({
          error:
            error instanceof Error
              ? error.message
              : "Error al obtener servicios",

          loading: false,
        });

      }
    },

    // =========================
    // GET BY ID
    // =========================

    getServiceByIdService:
      async (id) => {

        try {

          set({
            loading: true,
            error: null,
          });

          const service =
            await getServiceByIdService(id);

          set({
            serviceSeleccionado: service,
            loading: false,
          });

        } catch (error) {

          set({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener service",

            loading: false,
          });

        }

      },

    // =========================
    // GET BY TRABAJO
    // =========================

    getServiceByTrabajoIdService:
      async (trabajoId) => {

        try {

          set({
            loading: true,
            error: null,
          });

          const service =
            await getServiceByTrabajoIdService(
              trabajoId
            );

          set({
            serviceSeleccionado: service,
            loading: false,
          });

        } catch (error) {

          set({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener service",

            loading: false,
          });

        }

      },

    // =========================
    // CREATE
    // =========================

    createServiceService:
      async (payload) => {

        try {

          set({
            loading: true,
            error: null,
          });

          const service =
            await createServiceService(
              payload
            );

          set((state) => ({

            serviceSeleccionado: service,

            services: [
              service,
              ...state.services,
            ],

            loading: false,

          }));

          return service;

        } catch (error) {

          const mensaje =
            error instanceof Error
              ? error.message
              : "Error al crear service";

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

    updateServiceService:
      async (
        id,
        payload
      ) => {

        try {

          set({
            loading: true,
            error: null,
          });

          const service =
            await updateServiceService(
              id,
              payload
            );

          set((state) => ({

            serviceSeleccionado: service,

            services:
              state.services.map(
                (item) =>
                  item.id === service.id
                    ? service
                    : item
              ),

            loading: false,

          }));

          return service;

        } catch (error) {

          const mensaje =
            error instanceof Error
              ? error.message
              : "Error al actualizar service";

          set({
            error: mensaje,
            loading: false,
          });

          throw error;

        }

      },

    // =========================
    // CREATE REPUESTO
    // =========================

    addRepuestoService:
      async (payload) => {

        const repuesto =
          await createServiceRepuestoService(
            payload
          );

        set((state) => ({

          serviceSeleccionado:
            state.serviceSeleccionado
              ? {

                  ...state.serviceSeleccionado,

                  repuestos: [
                    ...state.serviceSeleccionado.repuestos,
                    repuesto,
                  ],

                }
              : null,

        }));

        return repuesto;

      },

    // =========================
    // UPDATE REPUESTO
    // =========================

    updateRepuestoService:
      async (
        id,
        payload
      ) => {

        const repuesto =
          await updateServiceRepuestoService(
            id,
            payload
          );

        set((state) => ({

          serviceSeleccionado:
            state.serviceSeleccionado
              ? {

                  ...state.serviceSeleccionado,

                  repuestos:
                    state.serviceSeleccionado.repuestos.map(
                      (item) =>
                        item.id === id
                          ? repuesto
                          : item
                    ),

                }
              : null,

        }));

        return repuesto;

      },

    // =========================
    // DELETE REPUESTO
    // =========================

    deleteRepuestoService:
      async (
        id,
        estadoTrabajo
      ) => {

        await deleteServiceRepuestoService(
          id,
          estadoTrabajo
        );

        set((state) => ({

          serviceSeleccionado:
            state.serviceSeleccionado
              ? {

                  ...state.serviceSeleccionado,

                  repuestos:
                    state.serviceSeleccionado.repuestos.filter(
                      (item) =>
                        item.id !== id
                    ),

                }
              : null,

        }));

      },

    // =========================
    // SELECT
    // =========================

    setServiceSeleccionado:
      (service) => {

        set({
          serviceSeleccionado: service,
        });

      },

    // =========================
    // CLEAR ERROR
    // =========================

    clearError: () => {

      set({
        error: null,
      });

    },

  }));
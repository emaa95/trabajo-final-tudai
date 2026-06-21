import { create } from 'zustand';

import type {
  Service,
  CreateServicioDto,
  UpdateServicioDto,
} from '@/types';

import {
  getServiceByIdService,
  getServiceByTrabajoIdService,
  createServiceService,
  updateServiceService,
} from '@/services/serviceService';

interface ServiceStore {
  serviceSeleccionado: Service | null;

  loading: boolean;

  error: string | null;

  getServiceByIdService: (
    id: string
  ) => Promise<void>;

  getServiceByTrabajoIdService: (
    trabajoId: string
  ) => Promise<void>;

  createServiceService: (
    payload: CreateServicioDto
  ) => Promise<Service>;

  updateServiceService: (
    id: string,
    payload: UpdateServicioDto
  ) => Promise<Service>;

  setServiceSeleccionado: (
    service: Service | null
  ) => void;

  clearError: () => void;
}

export const serviceStore =
  create<ServiceStore>((set) => ({
    serviceSeleccionado: null,

    loading: false,

    error: null,

    // =========================
    // GET BY ID
    // =========================

    getServiceByIdService: async (
      id: string
    ) => {
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
              : 'Error al obtener service',

          loading: false,
        });
      }
    },

    // =========================
    // GET BY TRABAJO ID
    // =========================

    getServiceByTrabajoIdService:
      async (trabajoId: string) => {
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
            serviceSeleccionado:
              service,

            loading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Error al obtener service',

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

          set({
            serviceSeleccionado:
              service,

            loading: false,
          });

          return service;
        } catch (error) {
          const mensaje =
            error instanceof Error
              ? error.message
              : 'Error al crear service';

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
      async (id, payload) => {
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

          set({
            serviceSeleccionado:
              service,

            loading: false,
          });

          return service;
        } catch (error) {
          const mensaje =
            error instanceof Error
              ? error.message
              : 'Error al actualizar service';

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

    setServiceSeleccionado: (
      service
    ) => {
      set({
        serviceSeleccionado:
          service,
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
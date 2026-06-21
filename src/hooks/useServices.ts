import { serviceStore } from '@/store/serviceStore';

export function useServices() {
  // =========================
  // STATE
  // =========================

  const serviceSeleccionado =
    serviceStore(
      (state) => state.serviceSeleccionado
    );

  const loading = serviceStore(
    (state) => state.loading
  );

  const error = serviceStore(
    (state) => state.error
  );

  // =========================
  // ACTIONS
  // =========================

  const getServiceByIdService =
    serviceStore(
      (state) =>
        state.getServiceByIdService
    );

  const getServiceByTrabajoIdService =
    serviceStore(
      (state) =>
        state.getServiceByTrabajoIdService
    );

  const createServiceService =
    serviceStore(
      (state) =>
        state.createServiceService
    );

  const updateServiceService =
    serviceStore(
      (state) =>
        state.updateServiceService
    );

  const setServiceSeleccionado =
    serviceStore(
      (state) =>
        state.setServiceSeleccionado
    );

  const clearError = serviceStore(
    (state) => state.clearError
  );

  return {
    // state
    serviceSeleccionado,
    loading,
    error,

    // actions
    getServiceByIdService,
    getServiceByTrabajoIdService,
    createServiceService,
    updateServiceService,
    setServiceSeleccionado,
    clearError,
  };
}
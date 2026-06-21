import { trabajoStore } from '@/store/trabajoStore';

export function useTrabajos() {
  return {
    trabajos: trabajoStore(
      (state) => state.trabajos
    ),

    trabajoSeleccionado:
      trabajoStore(
        (state) =>
          state.trabajoSeleccionado
      ),

    loading: trabajoStore(
      (state) => state.loading
    ),

    error: trabajoStore(
      (state) => state.error
    ),

    fetchTrabajos:
      trabajoStore(
        (state) =>
          state.fetchTrabajos
      ),

    fetchTrabajoById:
      trabajoStore(
        (state) =>
          state.fetchTrabajoById
      ),

    addTrabajo: trabajoStore(
      (state) => state.addTrabajo
    ),

    updateTrabajo:
      trabajoStore(
        (state) =>
          state.updateTrabajo
      ),

    setTrabajoSeleccionado:
      trabajoStore(
        (state) =>
          state.setTrabajoSeleccionado
      ),

    clearError: trabajoStore(
      (state) => state.clearError
    ),
  };
}
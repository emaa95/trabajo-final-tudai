import { vehiculosStore } from "@/store/vehiculoStore";

export function useVehiculos() {
  const {
    vehiculos,
    vehiculosByCliente,
    vehiculoSeleccionado,

    loading,
    error,

    fetchVehiculos,
    fetchVehiculoById,

    fetchVehiculosByCliente,

    clearVehiculoSeleccionado,
    clearVehiculosByCliente,

    addVehiculo,
    editVehiculo,
    removeVehiculo,
  } = vehiculosStore();


  return {
    vehiculos,
    vehiculosByCliente,
    vehiculoSeleccionado,

    loading,
    error,

    fetchVehiculos,
    fetchVehiculoById,

    fetchVehiculosByCliente,

    clearVehiculoSeleccionado,
    clearVehiculosByCliente,

    addVehiculo,
    editVehiculo,
    removeVehiculo,
  };
}
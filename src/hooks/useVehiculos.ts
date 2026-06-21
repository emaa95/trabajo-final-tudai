import { vehiculosStore } from "@/store/vehiculoStore";

export function useVehiculos() {
  const {
    vehiculos,
    vehiculosByCliente,
    loading,
    fetchVehiculos,
    fetchVehiculosByCliente,
    clearVehiculosByCliente,
    addVehiculo,
    editVehiculo,
    removeVehiculo,
  } = vehiculosStore();

  return {
    vehiculos,
    vehiculosByCliente,
    loading,
    fetchVehiculos,
    fetchVehiculosByCliente,
    clearVehiculosByCliente,
    addVehiculo,
    editVehiculo,
    removeVehiculo,
  };
}
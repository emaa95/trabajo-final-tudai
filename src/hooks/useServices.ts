import { serviceStore } from "@/store/serviceStore";

export function useServices() {

  const {
    services,
    serviceSeleccionado,
    loading,
    error,

    fetchServices,

    getServiceByIdService,
    getServiceByTrabajoIdService,

    createServiceService,
    updateServiceService,

    addRepuestoService,
    updateRepuestoService,
    deleteRepuestoService,

    setServiceSeleccionado,
    clearError,

  } = serviceStore();


  return {

    // listado
    services,
    fetchServices,

    // state
    serviceSeleccionado,
    loading,
    error,


    // service
    getServiceByIdService,
    getServiceByTrabajoIdService,

    createServiceService,
    updateServiceService,


    // repuestos
    addRepuestoService,
    updateRepuestoService,
    deleteRepuestoService,


    // general
    setServiceSeleccionado,
    clearError,

  };

}
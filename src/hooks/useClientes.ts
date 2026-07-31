import { clienteStore } from '@/store/clientesStore';

export function useClientes() {
  const {
    clientes,
    clienteSeleccionado,
    loading,
    error,
    fetchClientes,
    fetchClienteById,
    clearClienteSeleccionado,
    addCliente,
    editCliente,
  } = clienteStore();

  return {
    clientes,
    clienteSeleccionado,
    loading,
    error,
    fetchClientes,
    fetchClienteById,
    clearClienteSeleccionado,
    addCliente,
    editCliente,
  };
}
import { clienteStore } from '@/store/clientesStore';

export function useClientes() {
  const {
    clientes,
    clienteSeleccionado,
    loading,
    error,
    fetchClientes,
    addCliente,
  } = clienteStore();

  return {
    clientes,
    clienteSeleccionado,
    loading,
    error,
    fetchClientes,
    addCliente,
  };
}
// src/hooks/useAseguradoras.ts

import { aseguradoraStore } from '../store/aseguradoraStore';

export function useAseguradoras() {
  const aseguradoras = aseguradoraStore(
    (state) => state.aseguradoras
  );

  const loading = aseguradoraStore(
    (state) => state.loading
  );

  const error = aseguradoraStore(
    (state) => state.error
  );

  const fetchAseguradoras = aseguradoraStore(
    (state) => state.fetchAseguradoras
  );

  const addAseguradora = aseguradoraStore(
    (state) => state.addAseguradora
  );

  const updateAseguradora = aseguradoraStore(
    (state) => state.editAseguradora
  );

  const deleteAseguradora = aseguradoraStore(
    (state) => state.deleteAseguradora
  );
  
  return {
    aseguradoras,
    loading,
    error,
    fetchAseguradoras,
    addAseguradora,
    updateAseguradora,
    deleteAseguradora,
  };
}
import { aseguradoraStore } from "@/store/aseguradoraStore";

export function useAseguradoras() {
  const {
    aseguradoras,
    loading,
    error,
    fetchAseguradoras,
    addAseguradora,
    editAseguradora,
    deleteAseguradora,
  } = aseguradoraStore();

  return {
    aseguradoras,
    loading,
    error,
    fetchAseguradoras,
    addAseguradora,
    editAseguradora,
    deleteAseguradora,
  };
}
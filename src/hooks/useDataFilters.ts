import { useState, useCallback } from "react";

interface UseDataFiltersOptions {
  /** Valor inicial del ordenamiento. */
  defaultSort?: string;
  /** Valores iniciales de los filtros. Record<groupId, value> */
  defaultFilters?: Record<string, string>;
}

/**
 * Hook genérico para manejar el estado de búsqueda, orden y filtros.
 *
 * Uso:
 * ```ts
 * const { search, sortBy, activeFilters, filterProps } = useDataFilters({
 *   defaultSort: "nombre",
 *   defaultFilters: { estado: "todos" },
 * });
 * ```
 *
 * Pasá `filterProps` directamente al componente `<DataFilters />`.
 */
export function useDataFilters(options: UseDataFiltersOptions = {}) {
  const { defaultSort = "", defaultFilters = {} } = options;

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(defaultSort);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(defaultFilters);

  const handleFilterChange = useCallback((groupId: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [groupId]: value }));
  }, []);

  const reset = useCallback(() => {
    setSearch("");
    setSortBy(defaultSort);
    setActiveFilters(defaultFilters);
  }, [defaultSort, defaultFilters]);

  return {
    // Estado individual — útil para usarlo en `useMemo` de filtrado
    search,
    sortBy,
    activeFilters,

    // Props listos para pasarle a <DataFilters />
    filterProps: {
      searchValue: search,
      onSearchChange: setSearch,
      sortValue: sortBy,
      onSortChange: setSortBy,
      activeFilters,
      onFilterChange: handleFilterChange,
    },

    reset,
  };
}
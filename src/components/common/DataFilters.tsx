import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Un grupo de filtros tipo "pill tabs" (ej: Todos / Con vehículo / Sin vehículo).
 * Podés incluir varios grupos independientes en la misma barra.
 */
export interface FilterGroup {
  /** Identificador único del grupo, se usa como clave en `activeFilters`. */
  id: string;
  options: FilterOption[];
}

export interface DataFiltersProps {
  // ── Search ──────────────────────────────────
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  // ── Sort ────────────────────────────────────
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;

  // ── Filter groups ───────────────────────────
  filterGroups?: FilterGroup[];
  /** Record<groupId, selectedValue> */
  activeFilters?: Record<string, string>;
  onFilterChange?: (groupId: string, value: string) => void;

  // ── Layout ──────────────────────────────────
  className?: string;
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

export function DataFilters({
  searchValue = "",
  searchPlaceholder = "Buscar…",
  onSearchChange,
  sortOptions,
  sortValue,
  onSortChange,
  filterGroups,
  activeFilters = {},
  onFilterChange,
  className,
}: DataFiltersProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Search */}
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-64 pl-9"
          />
        </div>
      )}

      {/* Sort */}
      {sortOptions && sortOptions.length > 0 && onSortChange && (
        <Select value={sortValue} onValueChange={(v) => v && onSortChange(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Filter groups */}
      {filterGroups?.map((group) => (
        <div key={group.id} className="flex items-center gap-1 rounded-lg border p-1">
          {group.options.map((opt) => {
            const isActive = (activeFilters[group.id] ?? group.options[0]?.value) === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange?.(group.id, opt.value)}
                className={cn(
                  "rounded-md px-3 py-1 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
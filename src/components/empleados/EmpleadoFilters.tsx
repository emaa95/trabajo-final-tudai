import { Search } from 'lucide-react';

import type { RolEmpleado } from '../../types';

interface Props {
  busqueda: string;
  setBusqueda: (value: string) => void;

  filtroRol: RolEmpleado | 'Todos';
  setFiltroRol: (
    value: RolEmpleado | 'Todos'
  ) => void;

  filtroEstado:
    | 'Todos'
    | 'Activos'
    | 'Inactivos';

  setFiltroEstado: (
    value:
      | 'Todos'
      | 'Activos'
      | 'Inactivos'
  ) => void;

  roles: RolEmpleado[];
}

export function EmpleadoFilters({
  busqueda,
  setBusqueda,
  filtroRol,
  setFiltroRol,
  filtroEstado,
  setFiltroEstado,
  roles,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-3">
      {/* búsqueda */}

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />

        <input
          type="text"
          placeholder="Buscar por nombre, DNI, email..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* rol */}

      <select
        value={filtroRol}
        onChange={(e) =>
          setFiltroRol(
            e.target.value as
              | RolEmpleado
              | 'Todos'
          )
        }
        className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
      >
        <option value="Todos">
          Todos los roles
        </option>

        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {/* estado */}

      <select
        value={filtroEstado}
        onChange={(e) =>
          setFiltroEstado(
            e.target.value as
              | 'Todos'
              | 'Activos'
              | 'Inactivos'
          )
        }
        className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
      >
        <option value="Todos">
          Todos los estados
        </option>

        <option value="Activos">
          Activos
        </option>

        <option value="Inactivos">
          Inactivos
        </option>
      </select>
    </div>
  );
}
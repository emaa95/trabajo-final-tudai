import { UserCog } from 'lucide-react';

import type { RolEmpleado } from '../../types';

const rolColors: Record<RolEmpleado, string> = {
  Chapista: 'bg-orange-100 text-orange-700',
  Pintor: 'bg-blue-100 text-blue-700',
  Mecánico: 'bg-purple-100 text-purple-700',
  Administrativo: 'bg-slate-100 text-slate-700',
};

interface Props {
  rol: RolEmpleado;
}

export function RolBadge({ rol }: Props) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-1 rounded-full
        text-xs font-medium
        ${rolColors[rol]}
      `}
    >
      <UserCog className="size-3" />
      {rol}
    </span>
  );
}
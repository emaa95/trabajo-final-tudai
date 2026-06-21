import {
  Clock,
  Wrench,
  Paintbrush,
  CheckCircle2,
  PauseCircle,
  Ban,
  type LucideIcon,
} from 'lucide-react';

import type { EstadoTrabajo } from '../../types';

export const estadoConfig: {
  [K in EstadoTrabajo]: {
    icon: LucideIcon;
    headerClass: string;
    borderClass: string;
  };
} = {
  Pendiente: {
    icon: Clock,
    headerClass: 'bg-gray-100 text-gray-700',
    borderClass: 'border-l-gray-400',
  },

  'En reparación': {
    icon: Wrench,
    headerClass: 'bg-orange-100 text-orange-700',
    borderClass: 'border-l-orange-500',
  },

  'En pintura': {
    icon: Paintbrush,
    headerClass: 'bg-blue-100 text-blue-700',
    borderClass: 'border-l-blue-500',
  },

  Pausada: {
    icon: PauseCircle,
    headerClass: 'bg-yellow-100 text-yellow-700',
    borderClass: 'border-l-yellow-500',
  },

  'Listo para entregar': {
    icon: CheckCircle2,
    headerClass: 'bg-emerald-100 text-emerald-700',
    borderClass: 'border-l-emerald-500',
  },

  Entregado: {
    icon: CheckCircle2,
    headerClass: 'bg-green-100 text-green-700',
    borderClass: 'border-l-green-500',
  },

  Cancelada: {
    icon: Ban,
    headerClass: 'bg-red-100 text-red-700',
    borderClass: 'border-l-red-500',
  },
};
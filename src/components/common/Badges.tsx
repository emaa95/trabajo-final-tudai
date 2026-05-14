import type { EstadoTrabajo, EstadoSeguro, TipoTrabajo } from '../../types';
import { Badge } from '../ui/badge';

interface EstadoBadgeProps {
  estado: EstadoTrabajo;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const variants: Record<EstadoTrabajo, string> = {
    'Pendiente': 'bg-gray-500 hover:bg-gray-600',
    'En reparación': 'bg-orange-500 hover:bg-orange-600',
    'En pintura': 'bg-blue-500 hover:bg-blue-600',
    'Listo para entregar': 'bg-emerald-500 hover:bg-emerald-600',
    'Entregado': 'bg-green-700 hover:bg-green-800',
    'Cancelada': 'bg-red-500 hover:bg-red-600',
    'Pausada': 'bg-yellow-500 hover:bg-yellow-600',
  };

  return (
    <Badge className={variants[estado]}>
      {estado}
    </Badge>
  );
}

interface TipoBadgeProps {
  tipo: TipoTrabajo;
}

export function TipoBadge({ tipo }: TipoBadgeProps) {
  return (
    <Badge variant={tipo === 'Seguro' ? 'default' : 'secondary'}>
      {tipo}
    </Badge>
  );
}

interface SeguroBadgeProps {
  estado: EstadoSeguro;
}

export function SeguroBadge({ estado }: SeguroBadgeProps) {
  const variants: Record<EstadoSeguro, string> = {
    'Pendiente': 'bg-yellow-500 hover:bg-yellow-600',
    'Aprobado': 'bg-green-500 hover:bg-green-600',
    'Rechazado': 'bg-red-500 hover:bg-red-600',
  };

  return (
    <Badge className={variants[estado]}>
      {estado}
    </Badge>
  );
}
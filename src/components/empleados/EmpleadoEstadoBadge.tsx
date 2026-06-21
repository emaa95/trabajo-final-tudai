interface Props {
  activo: boolean;
}

export function EmpleadoEstadoBadge({
  activo,
}: Props) {
  if (activo) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
        Activo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
      <span className="size-1.5 rounded-full bg-red-400 inline-block" />
      Inactivo
    </span>
  );
}
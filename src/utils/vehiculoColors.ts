export const VEHICULO_COLORS: Record<string, string> = {
  blanco: "#ffffff",
  negro: "#111827",
  gris: "#9ca3af",
  plata: "#c0c0c0",
  rojo: "#dc2626",
  azul: "#2563eb",
  celeste: "#38bdf8",
  verde: "#16a34a",
  amarillo: "#eab308",
  naranja: "#f97316",
  marron: "#92400e",
  marrón: "#92400e",
  beige: "#d6c7a1",
  bordo: "#7f1d1d",
  violeta: "#7c3aed",
};

export function obtenerColorVehiculo(
  color?: string | null,
): string {
  if (!color) return "#9ca3af";

  return (
    VEHICULO_COLORS[color.toLowerCase().trim()] ??
    "#9ca3af"
  );
}
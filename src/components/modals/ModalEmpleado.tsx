// src/components/empleados/EmpleadoModal.tsx

import type {
  CreateEmpleadoDto,
  RolEmpleado,
} from '@/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

export interface EmpleadoModalProps {
  open: boolean;

  loading?: boolean;

  form: CreateEmpleadoDto;

  errors: Partial<
    Record<keyof CreateEmpleadoDto, string>
  >;

  onClose: () => void;

  onSave: (
    payload: CreateEmpleadoDto
  ) => Promise<void>;

  onChange: (
    field: keyof CreateEmpleadoDto,
    value: string
  ) => void;
}

const ROLES: RolEmpleado[] = [
  'Chapista',
  'Pintor',
  'Mecánico',
  'Administrativo',
];

export function EmpleadoModal({
  open,
  loading = false,
  form,
  errors,
  onClose,
  onSave,
  onChange,
}: EmpleadoModalProps) {
  const handleSave = async () => {
    await onSave(form);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Nuevo empleado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Nombre
            </label>

            <input
              value={form.nombre}
              onChange={(e) =>
                onChange(
                  'nombre',
                  e.target.value
                )
              }
              className="w-full rounded-md border p-2"
            />

            {errors.nombre && (
              <p className="text-sm text-red-500">
                {errors.nombre}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Apellido
            </label>

            <input
              value={form.apellido}
              onChange={(e) =>
                onChange(
                  'apellido',
                  e.target.value
                )
              }
              className="w-full rounded-md border p-2"
            />

            {errors.apellido && (
              <p className="text-sm text-red-500">
                {errors.apellido}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              DNI
            </label>

            <input
              value={form.dni}
              onChange={(e) =>
                onChange(
                  'dni',
                  e.target.value
                )
              }
              className="w-full rounded-md border p-2"
            />

            {errors.dni && (
              <p className="text-sm text-red-500">
                {errors.dni}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Teléfono
            </label>

            <input
              value={form.telefono}
              onChange={(e) =>
                onChange(
                  'telefono',
                  e.target.value
                )
              }
              className="w-full rounded-md border p-2"
            />

            {errors.telefono && (
              <p className="text-sm text-red-500">
                {errors.telefono}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Cargo
            </label>

            <select
              value={form.cargo}
              onChange={(e) =>
                onChange(
                  'cargo',
                  e.target.value
                )
              }
              className="w-full rounded-md border p-2"
            >
              {ROLES.map((rol) => (
                <option
                  key={rol}
                  value={rol}
                >
                  {rol}
                </option>
              ))}
            </select>

            {errors.cargo && (
              <p className="text-sm text-red-500">
                {errors.cargo}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSave}
              disabled={loading}
            >
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
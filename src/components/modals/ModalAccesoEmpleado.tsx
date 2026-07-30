import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type { Empleado } from "@/types";

interface EmpleadoAccesoModalProps {
  open: boolean;
  loading?: boolean;

  empleado: Empleado | null;

  email: string;
  isAdmin: boolean;

  onEmailChange: (value: string) => void;
  onIsAdminChange: (value: boolean) => void;

  onClose: () => void;
  onConfirm: () => void;
}

export function EmpleadoAccesoModal({
  open,
  loading = false,

  empleado,

  email,
  isAdmin,

  onEmailChange,
  onIsAdminChange,

  onClose,
  onConfirm,
}: EmpleadoAccesoModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Dar acceso al sistema
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Empleado seleccionado */}
          <div className="space-y-2">
            <Label>Empleado</Label>

            <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              {empleado
                ? `${empleado.nombre} ${empleado.apellido}`
                : "-"}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo electrónico
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="empleado@correo.com"
              value={email}
              onChange={(e) =>
                onEmailChange(e.target.value)
              }
            />
          </div>

          {/* Permisos administrador */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="admin-access"
              checked={isAdmin}
              onCheckedChange={(checked) =>
                onIsAdminChange(checked === true)
              }
            />

            <Label
              htmlFor="admin-access"
              className="cursor-pointer"
            >
              Otorgar permisos de administrador
            </Label>
          </div>

          {/* Información */}
          <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Se enviará un correo electrónico al empleado
            para que configure su contraseña y pueda acceder
            al sistema.
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              onClick={onConfirm}
              disabled={!email.trim() || loading}
            >
              {loading ? "Creando acceso..." : "Dar acceso"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
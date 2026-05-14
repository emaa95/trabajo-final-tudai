// components/trabajos/modal-cliente.tsx

import { useState } from "react";

import type {
  Cliente,
  ModalClienteProps,
} from "@/types";

import { Plus, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { FieldError } from "./FieldError";

const inputStyles =
  "transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2";

export function ModalCliente({
  open,
  onClose,
  onCreated,
}: ModalClienteProps) {
  const [nombre, setNombre] = useState("");

  const [telefono, setTelefono] =
    useState("");

  const [email, setEmail] = useState("");

  const [dni, setDni] = useState("");

  const [errors, setErrors] = useState<{
    nombre?: string;
    telefono?: string;
  }>({});

  const resetForm = () => {
    setNombre("");
    setTelefono("");
    setEmail("");
    setDni("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!nombre.trim()) {
      newErrors.nombre =
        "El nombre es obligatorio";
    }

    if (!telefono.trim()) {
      newErrors.telefono =
        "El teléfono es obligatorio";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nuevoCliente: Cliente = {
      id: `C-${Date.now()}`,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim() || undefined,
      dni: dni.trim(),
    };

    onCreated(nuevoCliente);

    resetForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) =>
        !v && handleClose()
      }
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-4" />
            Nuevo cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="m-nombre">
              Nombre completo
              <span className="text-destructive">
                {" "}
                *
              </span>
            </Label>

            <Input
              id="m-nombre"
              placeholder="Juan García"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);

                if (errors.nombre) {
                  setErrors((prev) => ({
                    ...prev,
                    nombre: undefined,
                  }));
                }
              }}
              className={`${inputStyles} ${
                errors.nombre
                  ? "border-destructive"
                  : ""
              }`}
            />

            <FieldError
              error={errors.nombre}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="m-telefono">
              Teléfono
              <span className="text-destructive">
                {" "}
                *
              </span>
            </Label>

            <Input
              id="m-telefono"
              placeholder="+54 11 1234-5678"
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);

                if (errors.telefono) {
                  setErrors((prev) => ({
                    ...prev,
                    telefono: undefined,
                  }));
                }
              }}
              className={`${inputStyles} ${
                errors.telefono
                  ? "border-destructive"
                  : ""
              }`}
            />

            <FieldError
              error={errors.telefono}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="m-email">
              Email
            </Label>

            <Input
              id="m-email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="m-dni">
              DNI / CUIT
            </Label>

            <Input
              id="m-dni"
              placeholder="20-12345678-9"
              value={dni}
              onChange={(e) =>
                setDni(e.target.value)
              }
              className={inputStyles}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={handleSave}
          >
            <Plus className="mr-2 size-4" />
            Crear cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
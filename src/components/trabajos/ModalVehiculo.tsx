// components/trabajos/modal-vehiculo.tsx

import { useState } from "react";

import type {
  ModalVehiculoProps,
  Vehiculo,
} from "@/types";

import { Car, Plus } from "lucide-react";

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

export function ModalVehiculo({
  open,
  clienteId,
  onClose,
  onCreated,
}: ModalVehiculoProps) {
  const [patente, setPatente] =
    useState("");

  const [marca, setMarca] =
    useState("");

  const [modelo, setModelo] =
    useState("");

  const [año, setAño] = useState("");

  const [color, setColor] =
    useState("");

  const [errors, setErrors] = useState<{
    patente?: string;
    marca?: string;
    modelo?: string;
  }>({});

  const resetForm = () => {
    setPatente("");
    setMarca("");
    setModelo("");
    setAño("");
    setColor("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!patente.trim()) {
      newErrors.patente =
        "La patente es obligatoria";
    }

    if (!marca.trim()) {
      newErrors.marca =
        "La marca es obligatoria";
    }

    if (!modelo.trim()) {
      newErrors.modelo =
        "El modelo es obligatorio";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nuevoVehiculo: Vehiculo = {
      id: `V-${Date.now()}`,
      clienteId,
      patente: patente
        .trim()
        .toUpperCase(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      año:
        parseInt(año) ||
        new Date().getFullYear(),
      color: color.trim(),
    };

    onCreated(nuevoVehiculo);

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
            <Car className="size-4" />
            Nuevo vehículo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="v-patente">
              Patente
              <span className="text-destructive">
                {" "}
                *
              </span>
            </Label>

            <Input
              id="v-patente"
              placeholder="AB 123 CD"
              value={patente}
              onChange={(e) => {
                setPatente(
                  e.target.value.toUpperCase()
                );

                if (errors.patente) {
                  setErrors((prev) => ({
                    ...prev,
                    patente: undefined,
                  }));
                }
              }}
              className={`${inputStyles} ${
                errors.patente
                  ? "border-destructive"
                  : ""
              }`}
            />

            <FieldError
              error={errors.patente}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="v-marca">
                Marca
                <span className="text-destructive">
                  {" "}
                  *
                </span>
              </Label>

              <Input
                id="v-marca"
                placeholder="Toyota"
                value={marca}
                onChange={(e) => {
                  setMarca(e.target.value);

                  if (errors.marca) {
                    setErrors((prev) => ({
                      ...prev,
                      marca: undefined,
                    }));
                  }
                }}
                className={`${inputStyles} ${
                  errors.marca
                    ? "border-destructive"
                    : ""
                }`}
              />

              <FieldError
                error={errors.marca}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="v-modelo">
                Modelo
                <span className="text-destructive">
                  {" "}
                  *
                </span>
              </Label>

              <Input
                id="v-modelo"
                placeholder="Corolla"
                value={modelo}
                onChange={(e) => {
                  setModelo(e.target.value);

                  if (errors.modelo) {
                    setErrors((prev) => ({
                      ...prev,
                      modelo: undefined,
                    }));
                  }
                }}
                className={`${inputStyles} ${
                  errors.modelo
                    ? "border-destructive"
                    : ""
                }`}
              />

              <FieldError
                error={errors.modelo}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="v-año">
                Año
              </Label>

              <Input
                id="v-año"
                type="number"
                min={1980}
                max={
                  new Date().getFullYear() +
                  1
                }
                placeholder={String(
                  new Date().getFullYear()
                )}
                value={año}
                onChange={(e) =>
                  setAño(e.target.value)
                }
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="v-color">
                Color
              </Label>

              <Input
                id="v-color"
                placeholder="Blanco"
                value={color}
                onChange={(e) =>
                  setColor(e.target.value)
                }
                className={inputStyles}
              />
            </div>
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
            Agregar vehículo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
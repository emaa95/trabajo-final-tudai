import { useEffect, useState } from "react";

import type {
  Cliente,
  CreateVehiculoDto,
  ModalVehiculoProps,
  UpdateVehiculoDto,
} from "@/types";

import { Car, Pencil, Plus } from "lucide-react";

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

import { FieldError } from "../forms/nuevoTrabajo/FieldError";

const inputStyles =
  "transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2";

type FormErrors = {
  clienteId?: string;
  patente?: string;
  marca?: string;
  modelo?: string;
};

interface Props extends ModalVehiculoProps {
  clientes: Cliente[];
}

export function ModalVehiculo({
  open,
  clientes,
  vehiculo,
  onClose,
  onCreated,
  onUpdated,
}: Props) {
  const isEditing = !!vehiculo;

  const [clienteId, setClienteId] = useState("");
  const [patente, setPatente] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [color, setColor] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ─────────────────────────────
  // Reset / precarga cuando cambia qué se está editando
  // o cuando se abre/cierra el modal
  // ─────────────────────────────
  useEffect(() => {
    if (!open) {
      setLoading(false);
      resetForm();
      setErrors({});
      return;
    }

    if (vehiculo) {
      setClienteId(vehiculo.cliente_id ?? "");
      setPatente(vehiculo.patente ?? "");
      setMarca(vehiculo.marca ?? "");
      setModelo(vehiculo.modelo ?? "");
      setAnio(vehiculo.anio ? String(vehiculo.anio) : "");
      setColor(vehiculo.color ?? "");
    } else {
      resetForm();
    }

    setErrors({});
  }, [open, vehiculo]);

  const resetForm = () => {
    setClienteId("");
    setPatente("");
    setMarca("");
    setModelo("");
    setAnio("");
    setColor("");
  };

  const handleClose = () => {
    setLoading(false);
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    const newErrors: FormErrors = {};

    if (!clienteId) newErrors.clienteId = "Seleccione un cliente";
    if (!patente.trim()) newErrors.patente = "Ingrese una patente";
    if (!marca.trim()) newErrors.marca = "Ingrese una marca";
    if (!modelo.trim()) newErrors.modelo = "Ingrese un modelo";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      if (isEditing && vehiculo) {
        const dto: UpdateVehiculoDto = {
          patente: patente.trim().toUpperCase(),
          marca: marca.trim(),
          modelo: modelo.trim(),
          anio: anio ? Number(anio) : undefined,
          color: color.trim() || undefined,
          cliente_id: clienteId,
        };

        await onUpdated?.(vehiculo.id, dto);
      } else {
        const dto: CreateVehiculoDto = {
          patente: patente.trim().toUpperCase(),
          marca: marca.trim(),
          modelo: modelo.trim(),
          anio: anio ? Number(anio) : undefined,
          color: color.trim() || undefined,
          cliente_id: clienteId,
          // TODO: taller_id es requerido por CreateVehiculoDto pero este
          // formulario no lo captura. Completar según de dónde salga
          // (contexto de sesión, prop del modal, etc.).
          taller_id: "",
        };

        await onCreated(dto);
      }

      handleClose();
    } catch (err) {
      console.error(
        isEditing
          ? "Error actualizando vehículo:"
          : "Error creando vehículo:",
        err,
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────
  // VISIBILITY GUARD (anti tab-switch freeze)
  // ─────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        setLoading(false);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="
    sm:max-w-md
    duration-300
    data-[state=open]:animate-in
    data-[state=closed]:animate-out
    data-[state=open]:fade-in-0
    data-[state=closed]:fade-out-0
    data-[state=open]:zoom-in-[98%]
    data-[state=closed]:zoom-out-[98%]
    data-[state=open]:slide-in-from-top-[48%]
    data-[state=closed]:slide-out-to-top-[48%]
  ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <Pencil className="size-4" />
            ) : (
              <Car className="size-4" />
            )}
            {isEditing ? "Editar vehículo" : "Nuevo vehículo"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Cliente */}
          <div>
            <Label>Cliente</Label>

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className={`${inputStyles} w-full rounded-md border p-2`}
            >
              <option value="">Seleccionar</option>

              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>

            <FieldError error={errors.clienteId} />
          </div>

          {/* Patente */}
          <div>
            <Label>Patente</Label>

            <Input
              value={patente}
              onChange={(e) =>
                setPatente(e.target.value.toUpperCase())
              }
            />

            <FieldError error={errors.patente} />
          </div>

          {/* Marca / Modelo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
              <FieldError error={errors.marca} />
            </div>

            <div>
              <Input
                placeholder="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
              <FieldError error={errors.modelo} />
            </div>
          </div>

          {/* Año / Color */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Año"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
            />

            <Input
              placeholder="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>

          <Button onClick={handleSave} disabled={loading}>
            {isEditing ? (
              <Pencil className="mr-2 size-4" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            {loading
              ? isEditing
                ? "Guardando..."
                : "Creando..."
              : isEditing
                ? "Guardar cambios"
                : "Crear vehículo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
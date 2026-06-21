import { useEffect, useState } from "react";

import type {
  Cliente,
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

import { FieldError } from "../forms/nuevoTrabajo/FieldError";
import { useVehiculos } from "@/hooks/useVehiculos";

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
  onClose,
}: Props) {
  const { addVehiculo } = useVehiculos();

  const [clienteId, setClienteId] = useState("");
  const [patente, setPatente] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [color, setColor] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ─────────────────────────────
  // Reset automático cuando se abre/cierra modal
  // evita estados colgados tras tab switch
  // ─────────────────────────────
  useEffect(() => {
    if (!open) {
      setLoading(false);
      resetForm();
      setErrors({});
    }
  }, [open]);

  const resetForm = () => {
    setClienteId("");
    setPatente("");
    setMarca("");
    setModelo("");
    setAnio("");
    setColor("");
    setErrors({});
  };

  const handleClose = () => {
    setLoading(false);
    resetForm();
    onClose();
  };

  // ─────────────────────────────
  // SAVE (CORREGIDO: async + await + control de flujo)
  // ─────────────────────────────
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
      const vehiculo: Vehiculo = {
        id: crypto.randomUUID(),
        patente: patente.trim().toUpperCase(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: anio ? Number(anio) : null,
        color: color.trim() || null,
        cliente_id: clienteId,
        created_at: new Date().toISOString(),
      };

      await addVehiculo(vehiculo);

      resetForm();
      handleClose();
    } catch (err) {
      console.error("Error creando vehículo:", err);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="size-4" />
            Nuevo vehículo
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
            <Plus className="mr-2 size-4" />
            {loading ? "Creando..." : "Crear vehículo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { useEffect, useState } from "react";

import type { Service, CreateServicioDto } from "@/types";

import { Wrench, Save } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

import { useServices } from "@/hooks/useServices";

import { FieldError } from "../forms/nuevoTrabajo/FieldError";

interface ModalServiceProps {
  open: boolean;
  trabajoId: string;
  service?: Service | null;
  onClose: () => void;
}

type FormErrors = {
  kilometraje_actual?: string;
};

export function ModalService({
  open,
  trabajoId,
  service,
  onClose,
}: ModalServiceProps) {
  const { createServiceService, updateServiceService } = useServices();

  const [kilometrajeActual, setKilometrajeActual] = useState("");
  const [proximoServiceKm, setProximoServiceKm] = useState("");
  const [proximaFechaService, setProximaFechaService] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!service) {
      setKilometrajeActual("");
      setProximoServiceKm("");
      setProximaFechaService("");
      setObservaciones("");
      setErrors({});
      return;
    }

    setKilometrajeActual(
      service.kilometraje_actual?.toString() ?? "",
    );

    setProximoServiceKm(
      service.proximo_service_km?.toString() ?? "",
    );

    setProximaFechaService(
      service.proxima_fecha_service ?? "",
    );

    setObservaciones(
      service.observaciones ?? "",
    );
  }, [service]);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    const newErrors: FormErrors = {};

    if (!kilometrajeActual.trim()) {
      newErrors.kilometraje_actual =
        "Ingrese el kilometraje";
    } else if (Number(kilometrajeActual) <= 0) {
      newErrors.kilometraje_actual =
        "Ingrese un kilometraje válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: CreateServicioDto = {
      trabajo_id: trabajoId,

      kilometraje_actual: Number(kilometrajeActual),

      proximo_service_km: proximoServiceKm
        ? Number(proximoServiceKm)
        : null,

      proxima_fecha_service:
        proximaFechaService || null,

      observaciones:
        observaciones.trim() || null,
    };

    try {
      if (service) {
        await updateServiceService(service.id, payload);
      } else {
        await createServiceService(payload);
      }

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && handleClose()}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="size-4" />
            {service ? "Editar Service" : "Registrar Service"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Kilometraje actual</Label>

            <Input
              type="number"
              value={kilometrajeActual}
              onChange={(e) =>
                setKilometrajeActual(e.target.value)
              }
            />

            <FieldError
              error={errors.kilometraje_actual}
            />
          </div>

          <div>
            <Label>Próximo service (km)</Label>

            <Input
              type="number"
              value={proximoServiceKm}
              onChange={(e) =>
                setProximoServiceKm(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Próxima fecha de service</Label>

            <Input
              type="date"
              value={proximaFechaService}
              onChange={(e) =>
                setProximaFechaService(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Observaciones del service</Label>

            <Textarea
              value={observaciones}
              onChange={(e) =>
                setObservaciones(e.target.value)
              }
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button onClick={handleSave}>
            <Save className="mr-2 size-4" />

            {service
              ? "Guardar cambios"
              : "Registrar Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
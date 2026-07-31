import { useEffect, useState } from "react";

import type {
  CreateClienteDto,
  ModalClienteProps,
  UpdateClienteDto,
} from "@/types";

import { Pencil, Plus, User } from "lucide-react";

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
  nombre?: string;
  apellido?: string;
  telefono?: string;
  documento?: string;
};

export function ModalCliente({
  open,
  cliente,
  onClose,
  onCreated,
  onUpdated,
}: ModalClienteProps) {

  const isEditing = !!cliente;

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [documento, setDocumento] = useState("");

  const [tipoDocumento, setTipoDocumento] =
    useState<"DNI" | "CUIL" | "CUIT">("DNI");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});


  useEffect(() => {
    if (!open) {
      setLoading(false);
      resetForm();
      setErrors({});
      return;
    }

    if (cliente) {
      setNombre(cliente.nombre ?? "");
      setApellido(cliente.apellido ?? "");
      setTelefono(cliente.telefono ?? "");
      setEmail(cliente.email ?? "");
      setDireccion(cliente.direccion ?? "");
      setDocumento(cliente.documento ?? "");
      setTipoDocumento(cliente.tipo_documento ?? "DNI");
    } else {
      resetForm();
    }

    setErrors({});
  }, [open, cliente]);


  const resetForm = () => {
    setNombre("");
    setApellido("");
    setTelefono("");
    setEmail("");
    setDireccion("");
    setDocumento("");
    setTipoDocumento("DNI");
  };


  const handleClose = () => {
    setLoading(false);
    resetForm();
    setErrors({});
    onClose();
  };


  const handleSave = async () => {
    const newErrors: FormErrors = {};

    if (!nombre.trim())
      newErrors.nombre = "El nombre es obligatorio";

    if (!apellido.trim())
      newErrors.apellido = "El apellido es obligatorio";

    if (!telefono.trim())
      newErrors.telefono = "El teléfono es obligatorio";

    if (!documento.trim())
      newErrors.documento = "El documento es obligatorio";


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    setLoading(true);

    try {

      if (isEditing && cliente) {

        const dto: UpdateClienteDto = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefono.trim() || undefined,
          email: email.trim() || undefined,
          direccion: direccion.trim() || undefined,
          documento: documento.trim(),
          tipo_documento: tipoDocumento,
        };

        await onUpdated?.(cliente.id, dto);

      } else {

        const dto: CreateClienteDto = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefono.trim() || undefined,
          email: email.trim() || undefined,
          direccion: direccion.trim() || undefined,
          documento: documento.trim(),
          tipo_documento: tipoDocumento,
        };

        onCreated?.(dto);
      }

      handleClose();

    } catch (err) {

      console.error(
        isEditing
          ? "Error actualizando cliente:"
          : "Error creando cliente:",
        err
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <Pencil className="size-4" />
            ) : (
              <User className="size-4" />
            )}

            {isEditing
              ? "Editar cliente"
              : "Nuevo cliente"}
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-4 py-2">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <Label>Nombre *</Label>

              <Input
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);

                  if (errors.nombre) {
                    setErrors((p) => ({
                      ...p,
                      nombre: undefined,
                    }));
                  }
                }}
                className={`${inputStyles} ${
                  errors.nombre ? "border-destructive" : ""
                }`}
              />

              <FieldError error={errors.nombre} />
            </div>


            <div className="space-y-2">
              <Label>Apellido *</Label>

              <Input
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);

                  if (errors.apellido) {
                    setErrors((p) => ({
                      ...p,
                      apellido: undefined,
                    }));
                  }
                }}
                className={`${inputStyles} ${
                  errors.apellido ? "border-destructive" : ""
                }`}
              />

              <FieldError error={errors.apellido} />
            </div>

          </div>


          <div className="space-y-2">
            <Label>Teléfono *</Label>

            <Input
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);

                if (errors.telefono) {
                  setErrors((p) => ({
                    ...p,
                    telefono: undefined,
                  }));
                }
              }}
              className={`${inputStyles} ${
                errors.telefono ? "border-destructive" : ""
              }`}
            />

            <FieldError error={errors.telefono} />
          </div>


          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className={inputStyles}
            />
          </div>


          <div className="space-y-2">
            <Label>Dirección</Label>

            <Input
              value={direccion}
              onChange={(e) =>
                setDireccion(e.target.value)
              }
              className={inputStyles}
            />
          </div>


          <div className="space-y-2">
            <Label>Tipo de documento *</Label>

            <select
              value={tipoDocumento}
              onChange={(e) =>
                setTipoDocumento(
                  e.target.value as
                    | "DNI"
                    | "CUIL"
                    | "CUIT"
                )
              }
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="DNI">DNI</option>
              <option value="CUIL">CUIL</option>
              <option value="CUIT">CUIT</option>
            </select>
          </div>


          <div className="space-y-2">
            <Label>Documento *</Label>

            <Input
              value={documento}
              onChange={(e) => {
                setDocumento(e.target.value);

                if (errors.documento) {
                  setErrors((p) => ({
                    ...p,
                    documento: undefined,
                  }));
                }
              }}
              className={`${inputStyles} ${
                errors.documento ? "border-destructive" : ""
              }`}
            />

            <FieldError error={errors.documento} />
          </div>

        </div>


        <DialogFooter className="gap-2">

          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>


          <Button
            onClick={handleSave}
            disabled={loading}
          >
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
                : "Crear cliente"}

          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
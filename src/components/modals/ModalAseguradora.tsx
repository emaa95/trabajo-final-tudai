import { useEffect, useState } from "react";

import type {
  Aseguradora,
  CreateAseguradoraDto,
  ModalAseguradoraProps,
  UpdateAseguradoraDto,
} from "@/types";

import { Pencil, Plus, Shield } from "lucide-react";

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
};


interface Props extends ModalAseguradoraProps {
  aseguradora?: Aseguradora | null;
}


export function ModalAseguradora({
  open,
  aseguradora,
  onClose,
  onCreated,
  onUpdated,
}: Props) {

  const isEditing = !!aseguradora;


  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cuit, setCuit] = useState("");


  const [loading, setLoading] = useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});



  useEffect(() => {

    if (!open) {

      setLoading(false);
      resetForm();
      setErrors({});

      return;
    }


    if (aseguradora) {

      setNombre(aseguradora.nombre ?? "");
      setTelefono(aseguradora.telefono ?? "");
      setEmail(aseguradora.email ?? "");
      setDireccion(aseguradora.direccion ?? "");
      setCuit(aseguradora.cuit ?? "");

    } else {

      resetForm();

    }


    setErrors({});

  }, [open, aseguradora]);



  const resetForm = () => {

    setNombre("");
    setTelefono("");
    setEmail("");
    setDireccion("");
    setCuit("");

  };



  const handleClose = () => {

    setLoading(false);
    resetForm();
    onClose();

  };



  const handleSave = async () => {

    const newErrors: FormErrors = {};


    if (!nombre.trim()) {
      newErrors.nombre =
        "Ingrese un nombre";
    }


    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors);
      return;

    }



    setLoading(true);



    try {


      if (isEditing && aseguradora) {


        const dto: UpdateAseguradoraDto = {

          nombre: nombre.trim(),

          telefono:
            telefono.trim() || undefined,

          email:
            email.trim() || undefined,

          direccion:
            direccion.trim() || undefined,

          cuit:
            cuit.trim() || undefined,

        };


        await onUpdated?.(
          aseguradora.id,
          dto,
        );



      } else {


        const dto: CreateAseguradoraDto = {

          nombre: nombre.trim(),

          telefono:
            telefono.trim() || undefined,

          email:
            email.trim() || undefined,

          direccion:
            direccion.trim() || undefined,

          cuit:
            cuit.trim() || undefined,

        };


        await onCreated(dto);

      }



      handleClose();


    } catch (err) {

      console.error(
        isEditing
          ? "Error actualizando aseguradora:"
          : "Error creando aseguradora:",
        err,
      );

    } finally {

      setLoading(false);

    }

  };



  return (

    <Dialog
      open={open}
      onOpenChange={(v) =>
        !v && handleClose()
      }
    >

      <DialogContent
        className="
        sm:max-w-md
        duration-300
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=open]:fade-in-0
        data-[state=closed]:fade-out-0
        data-[state=open]:zoom-in-[98%]
        data-[state=closed]:zoom-out-[98%]
        "
      >

        <DialogHeader>

          <DialogTitle className="flex items-center gap-2">

            {isEditing ? (

              <Pencil className="size-4" />

            ) : (

              <Shield className="size-4" />

            )}


            {isEditing
              ? "Editar aseguradora"
              : "Nueva aseguradora"}

          </DialogTitle>

        </DialogHeader>



        <div className="space-y-4 py-2">


          <div>

            <Label>
              Nombre *
            </Label>


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

              className={inputStyles}
            />


            <FieldError
              error={errors.nombre}
            />

          </div>



          <div>

            <Label>
              CUIT
            </Label>

            <Input
              value={cuit}
              onChange={(e) =>
                setCuit(e.target.value)
              }
              className={inputStyles}
            />

          </div>



          <div>

            <Label>
              Teléfono
            </Label>

            <Input
              value={telefono}
              onChange={(e) =>
                setTelefono(e.target.value)
              }
              className={inputStyles}
            />

          </div>



          <div>

            <Label>
              Email
            </Label>

            <Input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className={inputStyles}
            />

          </div>



          <div>

            <Label>
              Dirección
            </Label>

            <Input
              value={direccion}
              onChange={(e) =>
                setDireccion(e.target.value)
              }
              className={inputStyles}
            />

          </div>


        </div>



        <DialogFooter>


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
                : "Crear aseguradora"

            }


          </Button>


        </DialogFooter>


      </DialogContent>


    </Dialog>

  );
}
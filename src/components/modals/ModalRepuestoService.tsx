import { useEffect, useState } from "react";

import {
  REPUESTOS_SERVICE,
  TIPOS_ACEITE,
  type CreateServiceRepuestoDto,
  type RepuestoCatalogo,
  type ServiceRepuesto,
  type TipoAceite,
} from "@/types";

import { Package, Save } from "lucide-react";

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

import { useServices } from "@/hooks/useServices";


interface ModalRepuestoServiceProps {
  open: boolean;
  serviceId: string;
  repuesto?: ServiceRepuesto | null;
  onClose: (actualizar?: boolean) => void;
}


export function ModalRepuestoService({
  open,
  serviceId,
  repuesto,
  onClose,
}: ModalRepuestoServiceProps) {

  const {
    addRepuestoService,
  } = useServices();


  const [catalogo, setCatalogo] =
    useState<RepuestoCatalogo | null>(null);

  const [tipoAceite, setTipoAceite] =
    useState<TipoAceite | "">("");

  const [cantidad, setCantidad] =
    useState("1");


  useEffect(() => {

    if (!repuesto) {
      setCatalogo(null);
      setTipoAceite("");
      setCantidad("1");
    }

  }, [repuesto]);


  const unidad = catalogo?.unidad ?? "";


  const resetForm = () => {
    setCatalogo(null);
    setTipoAceite("");
    setCantidad("1");
  };


  const handleSave = async () => {

    if (!catalogo) return;


    const payload: CreateServiceRepuestoDto = {
      service_id: serviceId,

      descripcion:
        catalogo.id === "ACEITE_MOTOR"
          ? `Aceite ${tipoAceite}`
          : catalogo.nombre,

      cantidad: Number(cantidad),

      unidad,
    };


    try {

      await addRepuestoService(payload);

      resetForm();

      onClose(true);


    } catch (error) {

      console.error(
        "Error al crear repuesto:",
        error
      );

    }

  };


  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle className="flex items-center gap-2">

            <Package className="size-4" />

            {repuesto
              ? "Editar repuesto"
              : "Agregar repuesto"}

          </DialogTitle>

        </DialogHeader>


        <div className="space-y-5 py-2">


          <div className="space-y-2">

            <Label>
              Repuesto
            </Label>


            <select
              className="w-full rounded-md border p-2"
              value={catalogo?.id ?? ""}
              onChange={(e) => {

                const seleccionado =
                  REPUESTOS_SERVICE.find(
                    (r) => r.id === e.target.value
                  ) ?? null;


                setCatalogo(seleccionado);
                setTipoAceite("");

              }}
            >

              <option value="">
                Seleccionar
              </option>


              {REPUESTOS_SERVICE.map((r) => (

                <option
                  key={r.id}
                  value={r.id}
                >
                  {r.nombre}
                </option>

              ))}

            </select>

          </div>



          {catalogo?.id === "ACEITE_MOTOR" && (

            <div className="space-y-2">

              <Label>
                Tipo de aceite
              </Label>


              <select
                className="w-full rounded-md border p-2"
                value={tipoAceite}
                onChange={(e) =>
                  setTipoAceite(
                    e.target.value as TipoAceite
                  )
                }
              >

                <option value="">
                  Seleccionar
                </option>


                {TIPOS_ACEITE.map((tipo) => (

                  <option
                    key={tipo}
                    value={tipo}
                  >
                    {tipo}
                  </option>

                ))}

              </select>

            </div>

          )}



          <div className="grid grid-cols-2 gap-4">


            <div className="space-y-2">

              <Label>
                Cantidad
              </Label>


              <Input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) =>
                  setCantidad(e.target.value)
                }
              />

            </div>



            <div className="space-y-2">

              <Label>
                Unidad
              </Label>


              <Input
                value={unidad}
                disabled
              />

            </div>


          </div>


        </div>



        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onClose()}
          >
            Cancelar
          </Button>


          <Button
            onClick={handleSave}
          >

            <Save className="mr-2 size-4" />

            Guardar

          </Button>


        </DialogFooter>


      </DialogContent>

    </Dialog>
  );
}
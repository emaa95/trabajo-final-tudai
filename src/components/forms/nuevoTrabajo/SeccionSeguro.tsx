import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Shield } from "lucide-react";

import { FieldError } from "./FieldError";

import {
  useFormContext,
  useWatch,
} from "react-hook-form";

import type { TrabajoFormData } from "@/schemas/trabajoSchema";
import type { Aseguradora } from "@/types";


interface SeccionSeguroProps {
  aseguradoras: Aseguradora[];
}


export function SeccionSeguro({
  aseguradoras,
}: SeccionSeguroProps) {

  const {
    control,
    register,
    setValue,
    formState: {
      errors,
    },
  } = useFormContext<TrabajoFormData>();


  const aseguradoraId =
    useWatch({
      control,
      name: "seguro.aseguradora_id",
    });


  const aseguradoraSeleccionada =
    aseguradoras.find(
      (a) => a.id === aseguradoraId
    );


  return (
    <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-blue-100/40 dark:border-blue-950 dark:from-blue-950/30 dark:to-blue-900/10">

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
          <Shield className="size-5" />
          Información del Seguro
        </CardTitle>
      </CardHeader>


      <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">


        <div className="space-y-2">

          <Label>
            Compañía *
          </Label>


          <Select
            value={aseguradoraId ?? ""}
            onValueChange={(value) => {

              const nextValue =
                value || undefined;


              setValue(
                "seguro.aseguradora_id",
                nextValue,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              );

            }}
          >

            <SelectTrigger className="bg-background">

              <SelectValue placeholder="Seleccione una compañía">
                {aseguradoraSeleccionada?.nombre}
              </SelectValue>

            </SelectTrigger>


            <SelectContent>

              {aseguradoras.map(
                (aseguradora) => (

                  <SelectItem
                    key={aseguradora.id}
                    value={aseguradora.id}
                  >
                    {aseguradora.nombre}
                  </SelectItem>

                )
              )}

            </SelectContent>

          </Select>


          <FieldError
            error={
              errors.seguro?.aseguradora_id?.message
            }
          />

        </div>



        <div className="space-y-2">

          <Label htmlFor="numero_poliza">
            Número de póliza
          </Label>


          <Input
            id="numero_poliza"
            placeholder="Ej: POL-123456"
            {...register(
              "seguro.numero_poliza"
            )}
            className="bg-background"
          />


          <FieldError
            error={
              errors.seguro?.numero_poliza?.message
            }
          />

        </div>



        <div className="space-y-2">

          <Label htmlFor="numero_denuncia">
            Número de denuncia
          </Label>


          <Input
            id="numero_denuncia"
            placeholder="Ej: DEN-2026-001234"
            {...register(
              "seguro.numero_denuncia"
            )}
            className="bg-background"
          />


          <FieldError
            error={
              errors.seguro?.numero_denuncia?.message
            }
          />

        </div>



        <div className="space-y-2">

          <Label htmlFor="numero_siniestro">
            Número de siniestro *
          </Label>


          <Input
            id="numero_siniestro"
            placeholder="Ej: SIN-2026-001234"
            {...register(
              "seguro.numero_siniestro"
            )}
            className="bg-background"
          />


          <FieldError
            error={
              errors.seguro?.numero_siniestro?.message
            }
          />

        </div>



        <div className="space-y-2 lg:col-span-2">

          <Label htmlFor="monto_aprobado">
            Monto aprobado
          </Label>


          <Input
            id="monto_aprobado"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...register(
              "seguro.monto_aprobado",
              {
                valueAsNumber: true,
              }
            )}
            className="bg-background"
          />

        </div>


      </CardContent>

    </Card>
  );
}
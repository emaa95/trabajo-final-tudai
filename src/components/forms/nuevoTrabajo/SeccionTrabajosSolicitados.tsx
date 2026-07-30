import {
  useFormContext,
  useWatch,
} from "react-hook-form";

import {
  TRABAJOS_SOLICITADOS,
  type TrabajoSolicitado,
} from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";

import { FieldError } from "./FieldError";

import type { TrabajoFormData } from "@/schemas/trabajoSchema";


export function SeccionServiciosSolicitados() {

  const {
    control,
    setValue,
    formState: {
      errors,
    },
  } = useFormContext<TrabajoFormData>();


  const trabajosSolicitados =
    useWatch({
      control,
      name: "trabajos_solicitados",
    }) ?? [];



  const toggleTrabajo = (
    trabajo: TrabajoSolicitado
  ) => {

    const seleccionado =
      trabajosSolicitados.includes(trabajo);



    const nuevosTrabajos =
      seleccionado
        ? trabajosSolicitados.filter(
            (item) => item !== trabajo
          )
        : [
            ...trabajosSolicitados,
            trabajo,
          ];



    setValue(
      "trabajos_solicitados",
      nuevosTrabajos,
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      }
    );

  };



  return (

    <Card>

      <CardHeader>

        <CardTitle>
          Trabajo solicitado / Service
        </CardTitle>

      </CardHeader>



      <CardContent className="space-y-6">


        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {TRABAJOS_SOLICITADOS.map(
            (trabajo) => (

              <div
                key={trabajo}
                className="flex items-center gap-3 rounded-lg border p-3"
              >

                <Checkbox

                  id={trabajo}

                  checked={
                    trabajosSolicitados.includes(
                      trabajo
                    )
                  }

                  onCheckedChange={() =>
                    toggleTrabajo(trabajo)
                  }

                />



                <Label
                  htmlFor={trabajo}
                  className="cursor-pointer"
                >

                  {trabajo}

                </Label>


              </div>

            )
          )}

        </div>



        <FieldError
          error={
            errors.trabajos_solicitados?.message as string
          }
        />


      </CardContent>

    </Card>

  );
}
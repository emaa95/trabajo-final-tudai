import { useFormContext, useWatch } from "react-hook-form";

import { SeccionGeneral } from "../nuevoTrabajo/SeccionGeneral";
import { SeccionSeguro } from "../nuevoTrabajo/SeccionSeguro";

import type { Empleado, Aseguradora } from "@/types";

import type {
  TrabajoFormData,
} from "@/schemas/trabajoSchema";


interface PasoOrdenProps {
  empleados: Empleado[];
  aseguradoras: Aseguradora[];
}


export function PasoOrden({
  empleados,
  aseguradoras,
}: PasoOrdenProps) {

  const {
    control,
  } = useFormContext<TrabajoFormData>();


  const tipo = useWatch({
    control,
    name: "tipo",
  });


  return (
    <div className="space-y-4">

      <SeccionGeneral
        empleados={empleados}
      />


      {tipo === "Seguro" && (
        <SeccionSeguro
          aseguradoras={aseguradoras}
        />
      )}

    </div>
  );
}
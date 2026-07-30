import { SeccionTareas } from "../nuevoTrabajo/SeccionTareas";
import { SeccionServiciosSolicitados } from "../nuevoTrabajo/SeccionTrabajosSolicitados";


export function PasoTrabajo() {
  return (
    <>
      <SeccionServiciosSolicitados />

      <SeccionTareas />
    </>
  );
}
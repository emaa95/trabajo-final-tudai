import { SeccionTareas } from "../nuevoTrabajo/SeccionTareas";
import { SeccionServiciosSolicitados } from "../nuevoTrabajo/SeccionTrabajosSolicitados";

export function PasoTrabajo({
  trabajos_solicitados,
  otro_trabajo,
  tareas,
  notas,
  errors,
  setTrabajosSolicitados,
  setOtroTrabajo,
  setTareas,
  setNotas,
  clearError,
}: any) {
  return (
    <>
      <SeccionServiciosSolicitados
        trabajosSolicitados={trabajos_solicitados}
        otroTrabajo={otro_trabajo}
        error={errors.trabajosSolicitados}
        onTrabajosChange={setTrabajosSolicitados}
        onOtroTrabajoChange={setOtroTrabajo}
      />
      <SeccionTareas
        tareas={tareas}
        notas={notas}
        error={errors.tareas}
        onNotasChange={setNotas}
        onChange={(value) => {
          setTareas(value);
          clearError('tareas');
        }}
      />
    </>
  );
}
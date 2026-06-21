import { SeccionRecepcionVehiculo } from "../nuevoTrabajo/SeccionRecepcionVehiculo";


export function PasoRecepcion({
  estadoGeneral,
  combustible,
  observacionesRecepcion,
  pertenencias,
  otrasPertenencias,
  setEstadoGeneral,
  setCombustible,
  setObservacionesRecepcion,
  setPertenencias,
  setOtrasPertenencias,
}: any) {
  return (
    <SeccionRecepcionVehiculo
      estadoGeneral={estadoGeneral}
      combustible={combustible}
      observaciones={observacionesRecepcion}
      pertenencias={pertenencias}
      otrasPertenencias={otrasPertenencias}
      onEstadoGeneralChange={setEstadoGeneral}
      onCombustibleChange={setCombustible}
      onObservacionesChange={setObservacionesRecepcion}
      onPertenenciasChange={setPertenencias}
      onOtrasPertenenciasChange={setOtrasPertenencias}
    />
  );
}
import { SeccionVehiculo } from "../nuevoTrabajo/SeccionVehiculo";
import { SeccionCliente } from "../nuevoTrabajo/SeccionCliente";

import type {
  Vehiculo,
  Cliente,
} from "@/types";


interface PasoClienteVehiculoProps {
  clientes: Cliente[];
  vehiculos: Vehiculo[];

  onNuevoCliente: () => void;
  onNuevoVehiculo: () => void;
}


export function PasoClienteVehiculo({
  clientes,
  vehiculos,
  onNuevoCliente,
  onNuevoVehiculo,
}: PasoClienteVehiculoProps) {

  return (
    <div className="grid gap-4 lg:grid-cols-2">

      <SeccionCliente
        clientes={clientes}
        onNuevoCliente={onNuevoCliente}
      />


      <SeccionVehiculo
        vehiculos={vehiculos}
        onNuevoVehiculo={onNuevoVehiculo}
      />

    </div>
  );
}
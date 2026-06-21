import { SeccionVehiculo } from "../nuevoTrabajo/SeccionVehiculo";
import { SeccionCliente } from "../nuevoTrabajo/SeccionCliente";
import type { Vehiculo, Cliente, FormErrors } from "@/types";

interface PasoClienteVehiculoProps {
  clientes: Cliente[];
  vehiculos: Vehiculo[];
  clienteId: string | undefined;
  vehiculoId: string | undefined;
  errors: FormErrors;
  setClienteId: (id: string) => void;
  setVehiculoId: (id: string | undefined) => void;
  clearError: (field: keyof FormErrors) => void;
  onNuevoCliente: () => void;
  onNuevoVehiculo: () => void;
}

export function PasoClienteVehiculo({
  clientes,
  vehiculos,
  clienteId,
  vehiculoId,
  errors,
  setClienteId,
  setVehiculoId,
  clearError,
  onNuevoCliente,
  onNuevoVehiculo,
}: PasoClienteVehiculoProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SeccionCliente
        clientes={clientes}
        clienteId={clienteId}
        error={errors.clienteId}
        onClienteChange={(value) => {
          setClienteId(value);
          setVehiculoId(undefined);
          clearError("clienteId");
        }}
        onNuevoCliente={onNuevoCliente}
      />
      <SeccionVehiculo
        vehiculos={vehiculos}
        cliente_id={clienteId}
        vehiculoId={vehiculoId}
        error={errors.vehiculoId}
        onVehiculoChange={(value) => {
          setVehiculoId(value);
          clearError("vehiculoId");
        }}
        onNuevoVehiculo={onNuevoVehiculo}
      />
    </div>
  );
}
import { useState } from 'react';

import {
  ESTADOS_VEHICULO_INGRESO,
  NIVELES_COMBUSTIBLE,
  PERTENENCIAS_VEHICULO,
  type PertenenciaVehiculo,
  type SeccionRecepcionVehiculoProps,
} from '@/types';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export function SeccionRecepcionVehiculo({
  estadoGeneral,
  combustible,
  observaciones,
  pertenencias,
  otrasPertenencias,
  onEstadoGeneralChange,
  onCombustibleChange,
  onObservacionesChange,
  onPertenenciasChange,
  onOtrasPertenenciasChange,
}: SeccionRecepcionVehiculoProps) {
  const [habilitado, setHabilitado] = useState(false);

  const togglePertenencia = (pertenencia: PertenenciaVehiculo) => {
    const existe = pertenencias.includes(pertenencia);

    if (existe) {
      onPertenenciasChange(
        pertenencias.filter((item) => item !== pertenencia)
      );
      return;
    }

    onPertenenciasChange([...pertenencias, pertenencia]);
  };

  const handleToggle = (checked: boolean) => {
    setHabilitado(checked);

    // Al deshabilitar, limpiamos los valores para no incluir
    // datos parciales en el trabajo
    if (!checked) {
      onObservacionesChange('');
      onPertenenciasChange([]);
      onOtrasPertenenciasChange('');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Revisión del vehículo al ingreso</CardTitle>

          {!habilitado && (
            <p className="text-sm text-muted-foreground">
              Activá para registrar el estado del vehículo al momento de la recepción.
            </p>
          )}
        </div>

        <Switch
          checked={habilitado}
          onCheckedChange={handleToggle}
          aria-label="Registrar recepción del vehículo"
        />
      </CardHeader>

      {habilitado && (
        <CardContent className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-3">
            <Label>Estado general</Label>

            <RadioGroup
              value={estadoGeneral}
              onValueChange={(value) =>
                onEstadoGeneralChange(value as 'Bueno' | 'Regular' | 'Malo')
              }
              className="flex flex-wrap gap-6"
            >
              {ESTADOS_VEHICULO_INGRESO.map((estado) => (
                <div
                  key={estado}
                  className="flex items-center gap-2"
                >
                  <RadioGroupItem
                    value={estado}
                    id={`estado-${estado}`}
                  />

                  <Label htmlFor={`estado-${estado}`}>
                    {estado}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Combustible</Label>

            <RadioGroup
              value={combustible}
              onValueChange={(value) =>
                onCombustibleChange(
                  value as 'Vacío' | '1/4' | '1/2' | '3/4' | 'Lleno'
                )
              }
              className="flex flex-wrap gap-6"
            >
              {NIVELES_COMBUSTIBLE.map((nivel) => (
                <div
                  key={nivel}
                  className="flex items-center gap-2"
                >
                  <RadioGroupItem
                    value={nivel}
                    id={`combustible-${nivel}`}
                  />

                  <Label htmlFor={`combustible-${nivel}`}>
                    {nivel}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Daños visibles / Observaciones</Label>

            <Textarea
              rows={4}
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              placeholder="Detalle rayones, golpes, faltantes u observaciones relevantes..."
            />
          </div>

          <div className="space-y-4">
            <Label>Pertenencias entregadas</Label>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {PERTENENCIAS_VEHICULO.map((pertenencia) => (
                <div
                  key={pertenencia}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    id={pertenencia}
                    checked={pertenencias.includes(pertenencia)}
                    onCheckedChange={() => togglePertenencia(pertenencia)}
                  />

                  <Label
                    htmlFor={pertenencia}
                    className="cursor-pointer"
                  >
                    {pertenencia}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Otras pertenencias</Label>

              <Input
                value={otrasPertenencias}
                onChange={(e) => onOtrasPertenenciasChange(e.target.value)}
                placeholder="Detalle otras pertenencias entregadas"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
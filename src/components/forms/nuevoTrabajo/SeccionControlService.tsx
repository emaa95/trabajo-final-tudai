import { useState } from 'react';
import {
  TIPOS_ACEITE, REPUESTOS_SERVICE,
  type TipoAceite, type RepuestoService,
  type SeccionServiceProps,
} from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export function SeccionControlService({
  tipoAceite,
  repuestos,
  kilometrajeActual,
  otrosRepuestos,
  proximoServiceKm,
  proximoServiceFecha,
  onTipoAceiteChange,
  onRepuestosChange,
  onKilometrajeActualChange,
  onOtrosRepuestosChange,
  onProximoServiceKmChange,
  onProximoServiceFechaChange,
}: SeccionServiceProps) {
  const [habilitado, setHabilitado] = useState(false);

  const toggleRepuesto = (repuesto: RepuestoService) => {
    const existe = repuestos.includes(repuesto);
    onRepuestosChange(existe
      ? repuestos.filter((r) => r !== repuesto)
      : [...repuestos, repuesto]
    );
  };

  const handleToggle = (checked: boolean) => {
    setHabilitado(checked);
    if (!checked) {
      onTipoAceiteChange(undefined);
      onKilometrajeActualChange('');
      onRepuestosChange([]);
      onOtrosRepuestosChange('');
      onProximoServiceKmChange('');
      onProximoServiceFechaChange('');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Control de service</CardTitle>
          {!habilitado && (
            <p className="text-sm text-muted-foreground">
              Activá para registrar el aceite, repuestos colocados y el próximo service.
            </p>
          )}
        </div>
        <Switch
          checked={habilitado}
          onCheckedChange={handleToggle}
          aria-label="Registrar control de service"
        />
      </CardHeader>

      {habilitado && (
        <CardContent className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">

          {/* Kilometraje actual */}
          <div className="space-y-2">
            <Label>Kilometraje actual</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                value={kilometrajeActual}
                onChange={(e) => onKilometrajeActualChange(e.target.value)}
                placeholder="Ej: 85000"
                className="w-44 pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                km
              </span>
            </div>
          </div>

          {/* Tipo de aceite */}
          <div className="space-y-2">
            <Label>Tipo de aceite utilizado</Label>
            <Select
              value={tipoAceite}
              onValueChange={(value) => onTipoAceiteChange(value as TipoAceite)}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Seleccionar viscosidad..." />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_ACEITE.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Repuestos */}
          <div className="space-y-4">
            <Label>Repuestos / Filtros colocados</Label>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {REPUESTOS_SERVICE.map((repuesto) => (
                <div key={repuesto} className="flex items-center gap-3 rounded-lg border p-3">
                  <Checkbox
                    id={repuesto}
                    checked={repuestos.includes(repuesto)}
                    onCheckedChange={() => toggleRepuesto(repuesto)}
                  />
                  <Label htmlFor={repuesto} className="cursor-pointer">{repuesto}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Otros repuestos</Label>
              <Input
                value={otrosRepuestos}
                onChange={(e) => onOtrosRepuestosChange(e.target.value)}
                placeholder="Ej: kit de embrague, amortiguadores..."
              />
            </div>
          </div>

          {/* Próximo service */}
          <div className="space-y-4">
            <Label>Próximo service recomendado</Label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Kilometraje</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    value={proximoServiceKm}
                    onChange={(e) => onProximoServiceKmChange(e.target.value)}
                    placeholder="Ej: 10000"
                    className="w-44 pr-8"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    km
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Fecha estimada</Label>
                <Input
                  type="date"
                  value={proximoServiceFecha}
                  onChange={(e) => onProximoServiceFechaChange(e.target.value)}
                  className="w-44"
                />
              </div>
            </div>
          </div>

        </CardContent>
      )}
    </Card>
  );
}
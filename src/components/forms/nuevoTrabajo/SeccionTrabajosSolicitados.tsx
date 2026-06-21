import {
  TRABAJOS_SOLICITADOS,
  type SeccionServiciosSolicitadosProps,
  type TrabajoSolicitado,
} from '@/types';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

export function SeccionServiciosSolicitados({
  trabajosSolicitados,
  otroTrabajo,
  error,
  onTrabajosChange,
  onOtroTrabajoChange,
}: SeccionServiciosSolicitadosProps) {
  const toggleTrabajo = (
    trabajo: TrabajoSolicitado
  ) => {
    const seleccionado =
      trabajosSolicitados.includes(
        trabajo
      );

    if (seleccionado) {
      onTrabajosChange(
        trabajosSolicitados.filter(
          (item) => item !== trabajo
        )
      );

      return;
    }

    onTrabajosChange([
      ...trabajosSolicitados,
      trabajo,
    ]);
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
                  checked={trabajosSolicitados.includes(
                    trabajo
                  )}
                  onCheckedChange={() =>
                    toggleTrabajo(
                      trabajo
                    )
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

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="otroTrabajo">
            Otro
          </Label>

          <Input
            id="otroTrabajo"
            placeholder="Especifique otro trabajo solicitado"
            value={otroTrabajo}
            onChange={(e) =>
              onOtroTrabajoChange(
                e.target.value
              )
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
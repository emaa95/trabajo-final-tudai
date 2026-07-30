import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Car,
  Plus,
  Check,
  Search,
  Eye,
  ArrowRightLeft,
  Calendar,
} from "lucide-react";

import { FieldError } from "./FieldError";

import type { TrabajoFormData } from "@/schemas/trabajoSchema";
import type { Vehiculo } from "@/types";

interface SeccionVehiculoProps {
  vehiculos: Vehiculo[];
  onNuevoVehiculo: () => void;
}

function obtenerColorVehiculo(color?: string | null): string {
  if (!color) return "#9ca3af";

  const valor = color.toLowerCase().trim();

  const mapa: Record<string, string> = {
    blanco: "#ffffff",
    negro: "#111827",
    gris: "#9ca3af",
    plata: "#c0c0c0",
    rojo: "#dc2626",
    azul: "#2563eb",
    celeste: "#38bdf8",
    verde: "#16a34a",
    amarillo: "#eab308",
    naranja: "#f97316",
    marron: "#92400e",
    marrón: "#92400e",
    beige: "#d6c7a1",
    bordo: "#7f1d1d",
    violeta: "#7c3aed",
  };

  return mapa[valor] ?? "#9ca3af";
}

export function SeccionVehiculo({ vehiculos, onNuevoVehiculo }: SeccionVehiculoProps) {
  const [openVehiculo, setOpenVehiculo] = useState(false);

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TrabajoFormData>();

  const clienteId = useWatch({ control, name: "cliente_id" });
  const vehiculoId = useWatch({ control, name: "vehiculo_id" });
  const error = errors.vehiculo_id?.message;

  const vehiculoSeleccionado = vehiculos.find(
    (vehiculo) => vehiculo.id === vehiculoId,
  );

  const disabled = !clienteId;

  const handleVehiculoChange = (id: string) => {
    setValue("vehiculo_id", id, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Car className="size-5 text-emerald-600" />
            Vehículo
          </CardTitle>

          <Button
            type="button"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onNuevoVehiculo}
            disabled={disabled}
          >
            <Plus className="mr-1 size-4" />
            Nuevo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Label>
          Vehículo <span className="text-destructive">*</span>
        </Label>

        {!vehiculoSeleccionado ? (
          <>
            <div className="rounded-xl border border-dashed border-emerald-300 bg-background/70 p-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <Car className="size-7 text-emerald-600" />
              </div>

              <h3 className="font-medium">
                {disabled
                  ? "Seleccione un vehículo"
                  : "No hay vehículo seleccionado"}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {disabled
                  ? "Debe seleccionar un cliente antes de elegir un vehículo."
                  : "Seleccione un vehículo existente o cree uno nuevo."}
              </p>

              <Popover open={openVehiculo} onOpenChange={setOpenVehiculo}>
                <PopoverTrigger
                  disabled={disabled}
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Search className="mr-2 size-4" />
                  Seleccionar vehículo
                </PopoverTrigger>

                <PopoverContent className="w-105 p-0" align="center">
                  <Command>
                    <CommandInput placeholder="Buscar vehículo..." />

                    <CommandList>
                      <CommandEmpty>
                        <Button
                          type="button"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setOpenVehiculo(false);
                            onNuevoVehiculo();
                          }}
                        >
                          <Plus className="mr-2 size-4" />
                          Crear vehículo
                        </Button>
                      </CommandEmpty>

                      <CommandGroup>
                        {vehiculos.map((vehiculo) => (
                          <CommandItem
                            key={vehiculo.id}
                            value={`${vehiculo.patente} ${vehiculo.marca ?? ""} ${vehiculo.modelo ?? ""} ${vehiculo.color ?? ""}`}
                            onSelect={() => {
                              handleVehiculoChange(vehiculo.id);
                              setOpenVehiculo(false);
                            }}
                          >
                            <Check
                              className={`mr-2 size-4 ${
                                vehiculoId === vehiculo.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />

                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {vehiculo.patente}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {[vehiculo.marca, vehiculo.modelo]
                                  .filter(Boolean)
                                  .join(" ")}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <FieldError error={error} />
          </>
        ) : (
          <>
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                  <Car className="size-6 text-emerald-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold">
                    {vehiculoSeleccionado.patente}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {[vehiculoSeleccionado.marca, vehiculoSeleccionado.modelo]
                      .filter(Boolean)
                      .join(" ")}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {vehiculoSeleccionado.anio && (
                      <span>{vehiculoSeleccionado.anio}</span>
                    )}

                    {vehiculoSeleccionado.color && (
                      <>
                        <span>•</span>

                        <div className="flex items-center gap-2">
                          <div
                            className="size-2.5 rounded-full border"
                            style={{
                              backgroundColor: obtenerColorVehiculo(
                                vehiculoSeleccionado.color,
                              ),
                            }}
                          />

                          <span>{vehiculoSeleccionado.color}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Popover open={openVehiculo} onOpenChange={setOpenVehiculo}>
                  <PopoverTrigger
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <ArrowRightLeft className="mr-2 size-4" />
                    Cambiar vehículo
                  </PopoverTrigger>

                  <PopoverContent className="w-105 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar vehículo..." />

                      <CommandList>
                        <CommandGroup>
                          {vehiculos.map((vehiculo) => (
                            <CommandItem
                              key={vehiculo.id}
                              value={`${vehiculo.patente} ${vehiculo.marca ?? ""} ${vehiculo.modelo ?? ""}`}
                              onSelect={() => {
                                handleVehiculoChange(vehiculo.id);
                                setOpenVehiculo(false);
                              }}
                            >
                              <Check
                                className={`mr-2 size-4 ${
                                  vehiculoId === vehiculo.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />

                              <div className="flex flex-col">
                                <span className="font-semibold">
                                  {vehiculo.patente}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                  {[vehiculo.marca, vehiculo.modelo]
                                    .filter(Boolean)
                                    .join(" ")}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Dialog>
                  <DialogTrigger
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
                  >
                    <Eye className="mr-2 size-4" />
                    Ver ficha
                  </DialogTrigger>

                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Datos del vehículo</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Patente</p>
                          <p className="font-semibold">
                            {vehiculoSeleccionado.patente}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Marca</p>
                          <p className="font-semibold">
                            {vehiculoSeleccionado.marca ?? "-"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Modelo</p>
                          <p className="font-semibold">
                            {vehiculoSeleccionado.modelo ?? "-"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Año</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {vehiculoSeleccionado.anio ?? "-"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="sm:col-span-2">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">Color</p>

                          <div className="mt-1 flex items-center gap-2">
                            <div
                              className="size-3 rounded-full border"
                              style={{
                                backgroundColor: obtenerColorVehiculo(
                                  vehiculoSeleccionado.color,
                                ),
                              }}
                            />

                            <span className="font-semibold">
                              {vehiculoSeleccionado.color ?? "-"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <FieldError error={error} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
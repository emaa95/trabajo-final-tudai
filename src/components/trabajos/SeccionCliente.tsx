import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  User,
  Plus,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import { FieldError } from "./FieldError";

import type {
  SeccionClienteProps,
} from "@/types";

export function SeccionCliente({
  clientes,
  vehiculos,
  clienteId,
  vehiculoId,
  clienteError,
  vehiculoError,
  onClienteChange,
  onVehiculoChange,
  onNuevoCliente,
  onNuevoVehiculo,
}: SeccionClienteProps) {
  const [openCliente, setOpenCliente] =
    useState(false);

  const clienteSeleccionado = clientes.find(
    (c) => c.id === clienteId
  );

  return (
    <Card className="border-indigo-200 bg-indigo-50/40 dark:border-indigo-950 dark:bg-indigo-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <User className="size-5 text-indigo-600" />
          Cliente y Vehículo
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 flex justify-start gap-4">
        <div className="space-y-2">
          <Label>Cliente *</Label>

          <Popover
            open={openCliente}
            onOpenChange={setOpenCliente}
          >
            <PopoverTrigger className="w-full">
              <div
                role="combobox"
                className={`flex h-11 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm shadow-sm ${
                  clienteError
                    ? "border-destructive"
                    : "border-input"
                }`}
              >
                {clienteSeleccionado ? (
                  <div className="flex flex-col text-left">
                    <span className="font-medium">
                      {
                        clienteSeleccionado.nombre
                      }
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {
                        clienteSeleccionado.telefono
                      }
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Seleccione un cliente
                  </span>
                )}

                <ChevronsUpDown className="size-4 opacity-50" />
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />

                <CommandList>
                  <CommandEmpty className="p-3">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setOpenCliente(
                          false
                        );

                        onNuevoCliente();
                      }}
                    >
                      <Plus className="mr-2 size-4" />
                      Crear cliente
                    </Button>
                  </CommandEmpty>

                  <CommandGroup>
                    {clientes.map(
                      (cliente) => (
                        <CommandItem
                          key={cliente.id}
                          value={`${cliente.nombre} ${cliente.telefono}`}
                          onSelect={() => {
                            onClienteChange(
                              cliente.id
                            );

                            setOpenCliente(
                              false
                            );
                          }}
                        >
                          <Check
                            className={`mr-2 size-4 ${
                              clienteId ===
                              cliente.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />

                          <div className="flex flex-col">
                            <span className="font-medium">
                              {
                                cliente.nombre
                              }
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {
                                cliente.telefono
                              }
                            </span>
                          </div>
                        </CommandItem>
                      )
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FieldError
            error={clienteError}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Vehículo *</Label>

            {clienteId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={onNuevoVehiculo}
              >
                <Plus className="mr-1 size-3" />
                Agregar vehículo
              </Button>
            )}
          </div>

          <Select
            value={vehiculoId}
            onValueChange={(value) => {
              if (!value) return;

              onVehiculoChange(value);
            }}
            disabled={!clienteId}
          >
            <SelectTrigger className="bg-background shadow-sm">
              <SelectValue placeholder="Seleccione un vehículo" />
            </SelectTrigger>

            <SelectContent>
              {vehiculos.map((vehiculo) => (
                <SelectItem
                  key={vehiculo.id}
                  value={vehiculo.id}
                >
                  {vehiculo.patente} -{" "}
                  {vehiculo.marca}{" "}
                  {vehiculo.modelo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldError
            error={vehiculoError}
          />
        </div>
      </CardContent>
    </Card>
  );
}
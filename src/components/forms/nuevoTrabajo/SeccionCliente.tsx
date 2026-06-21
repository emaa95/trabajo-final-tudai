import { useState } from "react";

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
  User,
  Plus,
  Check,
  Phone,
  CreditCard,
  Search,
  Users,
  ArrowRightLeft,
  Eye,
} from "lucide-react";

import { FieldError } from "./FieldError";

import type { SeccionClienteProps } from "@/types";

export function SeccionCliente({
  clientes,
  clienteId,
  error,
  onClienteChange,
  onNuevoCliente,
}: SeccionClienteProps) {
  const [openCliente, setOpenCliente] = useState(false);

  const clienteSeleccionado = clientes.find(
    (cliente) => cliente.id === clienteId,
  );

  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="border-indigo-200 bg-indigo-50/40 dark:border-indigo-950 dark:bg-indigo-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <User className="size-5 text-indigo-600" />
            Cliente
          </CardTitle>

          <Button
            type="button"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={onNuevoCliente}
          >
            <Plus className="mr-1 size-4" />
            Nuevo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Label>
          Cliente <span className="text-destructive">*</span>
        </Label>

        {!clienteSeleccionado ? (
          <div className="rounded-xl border border-dashed border-indigo-300 bg-background/70 p-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-indigo-100">
              <Users className="size-7 text-indigo-600" />
            </div>

            <h3 className="font-medium">No hay cliente seleccionado</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Seleccione un cliente existente o cree uno nuevo.
            </p>

            {/* POPOVER TRIGGER (SIN BUTTON ADENTRO) */}
            <Popover open={openCliente} onOpenChange={setOpenCliente}>
              <PopoverTrigger
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Search className="mr-2 size-4" />
                Seleccionar cliente
              </PopoverTrigger>

              <PopoverContent className="w-107.5 p-0" align="center">
                <Command>
                  <CommandInput placeholder="Buscar por nombre o documento..." />

                  <CommandList>
                    <CommandEmpty>
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No se encontraron clientes
                      </div>
                    </CommandEmpty>

                    <CommandGroup>
                      {clientes.map((cliente) => (
                        <CommandItem
                          key={cliente.id}
                          value={`${cliente.nombre} ${cliente.documento ?? ""}`}
                          onSelect={() => {
                            onClienteChange(cliente.id);
                            setOpenCliente(false);
                          }}
                          className="mx-2 my-1 rounded-lg p-3"
                        >
                          <div className="mr-3 flex size-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {getInitials(cliente.nombre)}
                          </div>

                          <div className="flex flex-col">
                            <span className="font-medium">
                              {cliente.nombre}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {cliente.documento
                                ? `${cliente.tipo_documento} ${cliente.documento}`
                                : "Sin documento"}
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
        ) : (
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                {getInitials(clienteSeleccionado.nombre)}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold">
                  {clienteSeleccionado.nombre}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="size-4" />
                  <span>
                    {clienteSeleccionado.documento
                      ? `${clienteSeleccionado.tipo_documento} ${clienteSeleccionado.documento}`
                      : "Sin documento registrado"}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{clienteSeleccionado.telefono}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {/* POPOVER TRIGGER (SIN BUTTON ADENTRO) */}
              <Popover open={openCliente} onOpenChange={setOpenCliente}>
                <PopoverTrigger
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <ArrowRightLeft className="mr-2 size-4" />
                  Cambiar cliente
                </PopoverTrigger>

                <PopoverContent className="w-107.5 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar por nombre o documento..." />

                    <CommandList>
                      <CommandEmpty>
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No se encontraron clientes
                        </div>
                      </CommandEmpty>

                      <CommandGroup>
                        {clientes.map((cliente) => (
                          <CommandItem
                            key={cliente.id}
                            value={`${cliente.nombre} ${cliente.documento ?? ""}`}
                            onSelect={() => {
                              onClienteChange(cliente.id);
                              setOpenCliente(false);
                            }}
                          >
                            <Check
                              className={`mr-2 size-4 ${
                                clienteId === cliente.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />

                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {cliente.nombre}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {cliente.documento
                                  ? `${cliente.tipo_documento} ${cliente.documento}`
                                  : "Sin documento"}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* DIALOG TRIGGER (SIN BUTTON ADENTRO) */}
              <Dialog>
                <DialogTrigger
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
                >
                  <Eye className="mr-2 size-4" />
                  Ver ficha
                </DialogTrigger>

                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Datos del cliente</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Nombre</p>
                        <p className="font-semibold">
                          {clienteSeleccionado.nombre}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Teléfono</p>
                        <p className="font-semibold">
                          {clienteSeleccionado.telefono || "-"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold">
                          {clienteSeleccionado.email || "-"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Documento</p>
                        <p className="font-semibold">
                          {clienteSeleccionado.documento
                            ? `${clienteSeleccionado.tipo_documento} ${clienteSeleccionado.documento}`
                            : "-"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="sm:col-span-2">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Dirección</p>
                        <p className="font-semibold">
                          {clienteSeleccionado.direccion || "-"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        <FieldError error={error} />
      </CardContent>
    </Card>
  );
}
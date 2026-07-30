import { Calendar, Plus } from "lucide-react";

import type { Cliente } from "@/types";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ClienteProfileCardProps {
  cliente: Cliente;
  onNuevoVehiculo: () => void;
}

function getInitials(nombre: string, apellido?: string) {
  return `${nombre.charAt(0)}${apellido?.charAt(0) ?? ""}`.toUpperCase();
}

function formatFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(new Date(fecha));
}

export function ClienteProfileCard({
  cliente,
  onNuevoVehiculo,
}: ClienteProfileCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-8">
        <Avatar className="mb-5 size-24">
          <AvatarFallback className="text-2xl font-semibold">
            {getInitials(cliente.nombre, cliente.apellido)}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-center text-xl font-semibold">
          {cliente.nombre} {cliente.apellido}
        </h2>

        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          Cliente desde {formatFecha(cliente.created_at)}
        </p>

        <Button
          className="mt-6 w-full"
          onClick={onNuevoVehiculo}
        >
          <Plus className="mr-2 size-4" />
          Agregar vehículo
        </Button>

        <Separator className="my-8" />

        <div className="w-full space-y-5">
          <Info
            label="Documento"
            value={
              cliente.documento
                ? `${cliente.tipo_documento} ${cliente.documento}`
                : "-"
            }
          />

          <Info
            label="Teléfono"
            value={cliente.telefono ?? "-"}
          />

          <Info
            label="Email"
            value={cliente.email ?? "-"}
          />

          <Info
            label="Dirección"
            value={cliente.direccion ?? "-"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium wrap-break-word">
        {value}
      </p>
    </div>
  );
}
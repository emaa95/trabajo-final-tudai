import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { CurrentUser } from "@/types";

interface Props {
  currentUser: CurrentUser;
}

export function PerfilHeader({
  currentUser,
}: Props) {
  const { empleado } = currentUser;

  const initials =
    `${empleado.nombre[0]}${empleado.apellido[0]}`.toUpperCase();

  return (
    <Card>
      <CardHeader className="items-center">
        <Avatar className="size-24">
          <AvatarFallback className="text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>
      </CardHeader>

      <CardContent className="text-center space-y-3">
        <div>
          <h2 className="text-xl font-semibold">
            {empleado.nombre} {empleado.apellido}
          </h2>

          <p className="text-muted-foreground">
            {empleado.cargo}
          </p>
        </div>

        <Badge>
          {empleado.is_admin
            ? "Administrador"
            : "Empleado"}
        </Badge>
      </CardContent>
    </Card>
  );
}
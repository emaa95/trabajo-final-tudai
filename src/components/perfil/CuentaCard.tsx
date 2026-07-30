import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import type { CurrentUser } from "@/types";


interface Props {
  currentUser: CurrentUser;
}


export function CuentaCard({
  currentUser,
}: Props) {

  return (

    <Card>

      <CardHeader>
        <CardTitle>
          Información de cuenta
        </CardTitle>
      </CardHeader>


      <CardContent className="space-y-4">


        <div>
          <p className="text-sm text-muted-foreground">
            Email
          </p>

          <p className="font-medium">
            {currentUser.email}
          </p>
        </div>



        <div>
          <p className="text-sm text-muted-foreground">
            Rol
          </p>

          <Badge>
            {
              currentUser.empleado.is_admin
              ? "Administrador"
              : "Empleado"
            }
          </Badge>
        </div>



        <div>
          <p className="text-sm text-muted-foreground">
            Taller ID
          </p>

          <p className="font-medium">
            {currentUser.empleado.taller_id}
          </p>
        </div>


      </CardContent>

    </Card>

  );
}
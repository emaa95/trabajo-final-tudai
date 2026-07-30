import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { CurrentUser } from "@/types";

interface Props {
  currentUser: CurrentUser;
}

export function PerfilCard({
  currentUser,
}: Props) {
  const { empleado } = currentUser;

  const [nombre, setNombre] = useState(
    empleado.nombre
  );

  const [apellido, setApellido] = useState(
    empleado.apellido
  );

  const [cargo, setCargo] = useState(
    empleado.cargo
  );

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      // TODO:
      // conectar con updateEmpleado()

      console.log({
        nombre,
        apellido,
        cargo,
      });

    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Información personal
        </CardTitle>

        <CardDescription>
          Actualiza tus datos personales.
        </CardDescription>
      </CardHeader>


      <CardContent className="space-y-4">

        <div className="grid gap-2">
          <label>Nombre</label>

          <Input
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
          />
        </div>


        <div className="grid gap-2">
          <label>Apellido</label>

          <Input
            value={apellido}
            onChange={(e) =>
              setApellido(e.target.value)
            }
          />
        </div>


        <div className="grid gap-2">
          <label>Cargo</label>

          <Input
            value={cargo}
            onChange={(e) =>
              setCargo(e.target.value)
            }
          />
        </div>


        <div className="grid gap-2">
          <label>Email</label>

          <Input
            value={currentUser.email}
            disabled
          />
        </div>


      </CardContent>


      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Guardando..."
            : "Guardar cambios"}
        </Button>
      </CardFooter>

    </Card>
  );
}
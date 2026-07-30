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

import { supabase } from "@/lib/supabase";

export function SeguridadCard() {

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handlePassword() {

    if(password !== confirmPassword){
      return;
    }


    try {

      setLoading(true);

      await supabase.auth.updateUser({
        password,
      });


      setPassword("");
      setConfirmPassword("");

    } finally {
      setLoading(false);
    }
  }


  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Seguridad
        </CardTitle>

        <CardDescription>
          Cambia la contraseña de tu cuenta.
        </CardDescription>
      </CardHeader>


      <CardContent className="space-y-4">

        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
        />


        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e)=>
            setConfirmPassword(e.target.value)
          }
        />

      </CardContent>


      <CardFooter>

        <Button
          onClick={handlePassword}
          disabled={loading}
        >
          Cambiar contraseña
        </Button>

      </CardFooter>

    </Card>
  );
}
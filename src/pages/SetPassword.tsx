import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  passwordWithConfirmationSchema,
  type PasswordSchema,
} from "@/schemas/passwordSchema";


import { supabase } from "@/lib/supabase";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";



export function SetPassword() {

  const navigate = useNavigate();


  const [loading, setLoading] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");



  const {
    register,
    handleSubmit,
    formState:{
      errors,
    },
  } =
    useForm<PasswordSchema>({
      resolver:
        zodResolver(
          passwordWithConfirmationSchema
        ),
    });



  useEffect(() => {

    async function validarInvitacion(){

      try {

        const hash =
          window.location.hash;


        if(
          !hash.includes(
            "access_token"
          )
        ){
          throw new Error(
            "El enlace de invitación no es válido"
          );
        }


        const {
          data,
          error,
        } =
          await supabase.auth.getSession();


        if(error){
          throw error;
        }


        if(!data.session){
          throw new Error(
            "No se pudo validar la invitación"
          );
        }


      }catch(err){

        setError(
          err instanceof Error
            ? err.message
            : "Error validando invitación"
        );

      }finally{

        setLoading(false);

      }

    }


    validarInvitacion();

  },[]);



  const onSubmit = async(
    data: PasswordSchema
  )=>{

    try{

      setGuardando(true);
      setError("");


      const {
        error,
      } =
      await supabase.auth.updateUser({
        password:
          data.password,
      });


      if(error){
        throw error;
      }


      setSuccess(
        "Contraseña creada correctamente"
      );


      setTimeout(()=>{
        navigate("/auth");
      },2000);


    }catch(err){

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la contraseña"
      );

    }finally{

      setGuardando(false);

    }

  };



  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        Validando invitación...
      </div>
    );
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">

      <Card className="w-full max-w-md">

        <CardContent className="p-6 space-y-6">

          <div>
            <h1 className="text-xl font-bold">
              Crear contraseña
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Configurá tu contraseña para acceder al sistema.
            </p>
          </div>


          {error && (
            <div className="rounded-lg bg-red-50 text-red-600 p-3 text-sm">
              {error}
            </div>
          )}


          {success && (
            <div className="rounded-lg bg-green-50 text-green-600 p-3 text-sm">
              {success}
            </div>
          )}



          <form
            onSubmit={
              handleSubmit(onSubmit)
            }
            className="space-y-4"
          >


            <div>

              <label className="text-sm font-medium">
                Nueva contraseña
              </label>


              <input
                type="password"
                {...register(
                  "password"
                )}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />


              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}

            </div>



            <div>

              <label className="text-sm font-medium">
                Confirmar contraseña
              </label>


              <input
                type="password"
                {...register(
                  "confirmPassword"
                )}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />


              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>



            <Button
              type="submit"
              disabled={guardando}
              className="w-full"
            >
              {
                guardando
                ? "Guardando..."
                : "Crear contraseña"
              }
            </Button>


          </form>

        </CardContent>

      </Card>

    </div>
  );
}
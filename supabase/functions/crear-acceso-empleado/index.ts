import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  "https://trabajo-final-tudai.onrender.com",
  "http://localhost:5173",
];

serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";

  const corsHeaders = {
    "Access-Control-Allow-Origin":
      allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0],

    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",

    "Access-Control-Allow-Methods":
      "POST, OPTIONS",
  };


  // =========================
  // CORS PREFLIGHT
  // =========================

  if (req.method === "OPTIONS") {
    return new Response(
      "ok",
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  }


  try {

    // =========================
    // VALIDAR USUARIO ACTUAL
    // =========================

    const authHeader = req.headers.get(
      "Authorization",
    );


    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "No autorizado",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }


    const supabaseUrl =
      Deno.env.get("SUPABASE_URL")!;


    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY",
      )!;


    const appUrl =
      Deno.env.get("APP_URL") ??
      "https://trabajo-final-tudai.onrender.com";


    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
    );


    const token =
      authHeader.replace(
        "Bearer ",
        "",
      );


    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(token);



    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error:
            "Usuario inválido",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    // =========================
    // VALIDAR ADMIN
    // =========================

    const {
      data: adminEmpleado,
      error: adminError,
    } =
      await supabaseAdmin
        .from("EMPLEADOS")
        .select(
          `
          id,
          taller_id,
          is_admin
          `,
        )
        .eq(
          "auth_user_id",
          user.id,
        )
        .single();



    if (
      adminError ||
      !adminEmpleado ||
      !adminEmpleado.is_admin
    ) {
      return new Response(
        JSON.stringify({
          error:
            "No tienes permisos para crear accesos",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    // =========================
    // DATOS REQUEST
    // =========================

    const body =
      await req.json();


    const {
      empleado_id,
      email,
      is_admin,
    } = body;



    if (
      !empleado_id ||
      !email
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Datos incompletos",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    // =========================
    // BUSCAR EMPLEADO
    // =========================

    const {
      data: empleadoDestino,
      error: empleadoError,
    } =
      await supabaseAdmin
        .from("EMPLEADOS")
        .select(
          `
          id,
          taller_id,
          auth_user_id
          `,
        )
        .eq(
          "id",
          empleado_id,
        )
        .single();



    if (
      empleadoError ||
      !empleadoDestino
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Empleado no encontrado",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    if (
      empleadoDestino.taller_id !==
      adminEmpleado.taller_id
    ) {
      return new Response(
        JSON.stringify({
          error:
            "El empleado no pertenece al taller",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    if (
      empleadoDestino.auth_user_id
    ) {
      return new Response(
        JSON.stringify({
          error:
            "El empleado ya posee acceso al sistema.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    // =========================
    // ENVIAR INVITACIÓN
    // =========================

    const {
      data: invitedUser,
      error: inviteError,
    } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo:
            `${appUrl}/auth/set-password`,

          data: {
            empleado_id,

            taller_id:
              empleadoDestino.taller_id,

            is_admin:
              is_admin ?? false,
          },
        },
      );



    if (
      inviteError ||
      !invitedUser.user
    ) {
      return new Response(
        JSON.stringify({
          error:
            inviteError?.message ??
            "No se pudo enviar la invitación",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    // =========================
    // ACTUALIZAR EMPLEADO
    // =========================

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from("EMPLEADOS")
        .update({
          auth_user_id:
            invitedUser.user.id,

          email,

          is_admin:
            is_admin ?? false,
        })
        .eq(
          "id",
          empleado_id,
        );



    if (updateError) {
      return new Response(
        JSON.stringify({
          error:
            updateError.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        },
      );
    }



    return new Response(
      JSON.stringify({
        success: true,

        message:
          "Se envió la invitación correctamente.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      },
    );


  } catch (error) {

    console.error(error);


    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      },
    );
  }
});
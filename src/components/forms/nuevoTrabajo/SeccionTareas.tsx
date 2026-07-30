import { useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
  ClipboardList,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";

import { FieldError } from "./FieldError";

import type { TrabajoFormData } from "@/schemas/trabajoSchema";


export function SeccionTareas() {

  const [titulo, setTitulo] = useState("");
  const [costo, setCosto] = useState("");


  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TrabajoFormData>();


  const {
    fields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "tareas",
  });


  const tareas =
    useWatch({
      control,
      name: "tareas",
    }) ?? [];



  const agregarTarea = () => {

    const descripcion =
      titulo.trim();


    if (!descripcion) return;


    append({
      titulo: descripcion,
      realizada: false,
      costo: Number(costo) || 0,
    });


    setTitulo("");
    setCosto("");

  };



  const toggleRealizada = (
    index: number
  ) => {

    const tarea =
      tareas[index];


    if (!tarea) return;


    update(index, {
      ...tarea,
      realizada: !tarea.realizada,
    });

  };



  const eliminarTarea = (
    index: number
  ) => {

    remove(index);

  };



  const total =
    tareas.reduce(
      (acc, tarea) =>
        acc + (tarea.costo ?? 0),
      0
    );



  return (

    <Card className="overflow-hidden border-0 shadow-md p-0">

      <CardHeader className="rounded-t-xl bg-linear-to-r from-orange-500 to-amber-500 text-white p-2">

        <CardTitle className="flex items-center gap-2">

          <ClipboardList className="size-5" />

          Tareas del Trabajo

        </CardTitle>

      </CardHeader>



      <CardContent className="space-y-6 p-6">


        <div className="grid gap-4 lg:grid-cols-[1fr_180px_auto]">


          <div className="space-y-2">

            <Label>
              Descripción de la tarea
            </Label>


            <Input
              placeholder="Ej: Reparar paragolpe delantero"
              value={titulo}
              onChange={(e)=>setTitulo(e.target.value)}
              className="h-11"
            />

          </div>



          <div className="space-y-2">

            <Label>
              Costo estimado
            </Label>


            <div className="relative">

              <DollarSign className="absolute left-3 top-3 size-4 text-muted-foreground" />


              <Input
                type="number"
                min={0}
                placeholder="0"
                value={costo}
                onChange={(e)=>setCosto(e.target.value)}
                className="h-11 pl-9"
              />

            </div>

          </div>



          <div className="flex items-end">

            <Button
              type="button"
              onClick={agregarTarea}
              className="h-11 w-full"
            >

              <Plus className="mr-2 size-4" />

              Agregar

            </Button>

          </div>


        </div>



        <FieldError
          error={errors.tareas?.message as string}
        />



        {fields.length > 0 && (

          <div className="overflow-hidden rounded-xl border bg-background">

            <div className="divide-y">

              {fields.map((field,index)=>{

                const tarea =
                  tareas[index];


                if(!tarea)
                  return null;


                return (

                  <div
                    key={field.id}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
                  >

                    <div className="flex items-center gap-4">


                      <Checkbox
                        checked={tarea.realizada}
                        onCheckedChange={() =>
                          toggleRealizada(index)
                        }
                      />


                      <div className="space-y-1">


                        <p
                          className={
                            `font-medium ${
                              tarea.realizada
                              ? "text-muted-foreground line-through"
                              : ""
                            }`
                          }
                        >

                          {tarea.titulo}

                        </p>



                        <p className="text-sm text-muted-foreground">

                          ${tarea.costo.toLocaleString("es-AR")}

                        </p>


                      </div>


                    </div>



                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        eliminarTarea(index)
                      }
                    >

                      <Trash2 className="size-4 text-destructive" />

                    </Button>


                  </div>

                );

              })}

            </div>

          </div>

        )}



        <div className="rounded-xl border bg-muted/30 p-4">

          <div className="flex items-center justify-between">


            <div>

              <p className="text-sm text-muted-foreground">
                Total estimado
              </p>


              <p className="text-3xl font-bold tracking-tight">

                ${total.toLocaleString("es-AR")}

              </p>

            </div>



            <div className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">

              {tareas.length} tareas

            </div>


          </div>

        </div>



        <div className="space-y-2">


          <Label htmlFor="notas">
            Notas adicionales
          </Label>


          <Textarea
            id="notas"
            placeholder="Aclaraciones internas, repuestos, observaciones..."
            {...register("notas")}
            className="min-h-30 resize-none"
          />


        </div>


      </CardContent>

    </Card>

  );

}
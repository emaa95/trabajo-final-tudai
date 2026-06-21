// components/trabajos/SeccionTareas.tsx

import { useState } from "react";

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

import type { TareaTrabajo } from "@/types";

interface SeccionTareasProps {
  tareas: TareaTrabajo[];

  notas: string;

  error?: string;

  onNotasChange: (
    value: string
  ) => void;

  onChange: (
    tareas: TareaTrabajo[]
  ) => void;
}

export function SeccionTareas({
  tareas,
  notas,
  error,
  onNotasChange,
  onChange,
}: SeccionTareasProps) {
  const [titulo, setTitulo] =
    useState("");

  const [costo, setCosto] =
    useState("");

  const agregarTarea = () => {
    if (!titulo.trim()) return;

    const nuevaTarea: TareaTrabajo = {
      id: `TT-${Date.now()}`,

      titulo: titulo.trim(),

      realizada: false,

      costo: Number(costo) || 0,
    };

    onChange([
      ...tareas,
      nuevaTarea,
    ]);

    setTitulo("");
    setCosto("");
  };

  const eliminarTarea = (
    id: string
  ) => {
    onChange(
      tareas.filter(
        (tarea) => tarea.id !== id
      )
    );
  };

  const toggleRealizada = (
    id: string
  ) => {
    onChange(
      tareas.map((tarea) =>
        tarea.id === id
          ? {
              ...tarea,
              realizada:
                !tarea.realizada,
            }
          : tarea
      )
    );
  };

  const total = tareas.reduce(
    (acc, tarea) =>
      acc + tarea.costo,
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
              onChange={(e) =>
                setTitulo(
                  e.target.value
                )
              }
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
                onChange={(e) =>
                  setCosto(
                    e.target.value
                  )
                }
                className="h-11 pl-9"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              onClick={
                agregarTarea
              }
              className="h-11 w-full"
            >
              <Plus className="mr-2 size-4" />
              Agregar
            </Button>
          </div>
        </div>

        <FieldError error={error} />

        {tareas.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-background">
            <div className="divide-y">
              {tareas.map(
                (tarea) => (
                  <div
                    key={tarea.id}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={
                          tarea.realizada
                        }
                        onCheckedChange={() =>
                          toggleRealizada(
                            tarea.id
                          )
                        }
                      />

                      <div className="space-y-1">
                        <p
                          className={`font-medium ${
                            tarea.realizada
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {
                            tarea.titulo
                          }
                        </p>

                        <p className="text-sm text-muted-foreground">
                          $
                          {tarea.costo.toLocaleString(
                            "es-AR"
                          )}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        eliminarTarea(
                          tarea.id
                        )
                      }
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                )
              )}
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
                $
                {total.toLocaleString(
                  "es-AR"
                )}
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
            value={notas}
            onChange={(e) =>
              onNotasChange(
                e.target.value
              )
            }
            className="min-h-30 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
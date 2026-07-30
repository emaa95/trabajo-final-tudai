import { useState } from "react";
import { CheckCircle, Clock, Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import type { TareaTrabajoDraft } from "@/types";

interface Props {
  tareas: TareaTrabajoDraft[];

  editando: boolean;

  puedeAgregar: boolean;

  puedeEditar: boolean;

  puedeEliminar: boolean;

  puedeCambiarRealizada: boolean;

  onChange: (tareas: TareaTrabajoDraft[]) => void;

  onToggleRealizada: (tareaId: string, realizada: boolean) => void;

  onDelete: (tarea: TareaTrabajoDraft) => void;
}

export function TareasCard({
  tareas,
  editando,
  puedeAgregar,
  puedeEditar,
  puedeEliminar,
  puedeCambiarRealizada,
  onChange,
  onToggleRealizada,
  onDelete,
}: Props) {
  const [costosEditados, setCostosEditados] = useState<Record<string, string>>({});

  const actualizarTarea = (
    id: string,
    campo: keyof TareaTrabajoDraft,
    valor: unknown,
  ) => {
    const nuevasTareas = tareas.map((tarea) => {
      if (tarea.id !== id) {
        return tarea;
      }

      return {
        ...tarea,
        [campo]: valor,
      };
    });

    onChange(nuevasTareas);
  };

  const agregarTarea = () => {
    const nuevaTarea: TareaTrabajoDraft = {
      id: crypto.randomUUID(),
      titulo: "",
      costo: 0,
      realizada: false,
      isNew: true,
    };

    onChange([...tareas, nuevaTarea]);
  };

  const obtenerCostoInput = (tarea: TareaTrabajoDraft) => {
    return costosEditados[tarea.id!] ?? String(tarea.costo);
  };

  const puedeEditarTitulo = editando && puedeEditar;
  const puedeEliminarTarea = editando && puedeEliminar;
  const puedeAgregarTarea = editando && puedeAgregar;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-slate-500" />
            Tareas
          </CardTitle>

          {puedeAgregarTarea && (
            <Button
              size="sm"
              variant="outline"
              onClick={agregarTarea}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar tarea
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {tareas.length === 0 ? (
          <p className="text-sm text-slate-500">
            Sin tareas registradas
          </p>
        ) : (
          tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                p-3
              "
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={tarea.realizada}
                  disabled={!puedeCambiarRealizada}
                  onCheckedChange={(value) =>
                    onToggleRealizada(
                      tarea.id!,
                      Boolean(value)
                    )
                  }
                />

                {tarea.realizada ? (
                  <CheckCircle
                    className="
                      size-5
                      text-emerald-500
                    "
                  />
                ) : (
                  <Clock
                    className="
                      size-5
                      text-slate-400
                    "
                  />
                )}

                {puedeEditarTitulo ? (
                  <Input
                    value={tarea.titulo}
                    onChange={(e) =>
                      actualizarTarea(
                        tarea.id!,
                        "titulo",
                        e.target.value
                      )
                    }
                    placeholder="Descripción tarea"
                    className="w-64"
                  />
                ) : (
                  <div>
                    <p className="font-medium">
                      {tarea.titulo}
                    </p>

                    <p className="text-xs text-slate-500">
                      {tarea.realizada
                        ? "Realizada"
                        : "Pendiente"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {puedeEditarTitulo ? (
                  <Input
                    type="number"
                    value={obtenerCostoInput(tarea)}
                    onChange={(e) => {
                      const valor = e.target.value;

                      setCostosEditados((prev) => ({
                        ...prev,
                        [tarea.id!]: valor,
                      }));

                      actualizarTarea(
                        tarea.id!,
                        "costo",
                        valor === ""
                          ? 0
                          : Number(valor)
                      );
                    }}
                    className="w-32"
                  />
                ) : (
                  <span className="font-medium">
                    {tarea.costo.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                )}

                {puedeEliminarTarea && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(tarea)}
                  >
                    <Trash2
                      className="
                        size-4
                        text-red-500
                      "
                    />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
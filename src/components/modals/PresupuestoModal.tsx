import { useRef } from 'react';

import type {
  TrabajoDetalle,
} from '@/types';

import {
  X,
  Printer,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PresupuestoModalProps {
  trabajo: TrabajoDetalle;
  
  onClose: () => void;
}

export function PresupuestoModal({
  trabajo,
  onClose,
}: PresupuestoModalProps) {
  const printRef =
    useRef<HTMLDivElement>(null);
  
  const seguro =
  trabajo.seguro?.[0];

  const items =
  trabajo.tareas?.map(
    (tarea) => ({
      descripcion: tarea.titulo,
      cantidad: 1,
      precioUnitario:
        tarea.costo,
    })
  ) ?? [];

  const subtotal = items.reduce(
    (acc, item) =>
      acc +
      item.cantidad *
        item.precioUnitario,
    0
  );

  const iva = subtotal * 0.21;

  const total =
    subtotal + iva;

  const montoAprobado =
  seguro?.monto_aprobado ?? 0;

  const formatMonto = (
    monto: number
  ) =>
    new Intl.NumberFormat(
      'es-AR',
      {
        style: 'currency',
        currency: 'ARS',
      }
    ).format(monto);

  const formatFecha = (
    fecha: string
  ) =>
    new Date(
      fecha
    ).toLocaleDateString(
      'es-AR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    );

  const handlePrint = () => {
    const printContent =
      printRef.current;

    if (!printContent)
      return;

    const originalBody =
      document.body.innerHTML;

    document.body.innerHTML =
      printContent.innerHTML;

    window.print();

    document.body.innerHTML =
      originalBody;

    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Presupuesto de
            Reparación
          </h2>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={
                handlePrint
              }
            >
              <Printer className="size-4 mr-2" />
              Imprimir
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={
                onClose
              }
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div ref={printRef}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-10 rounded-lg bg-slate-900 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      C
                    </span>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      Chapa &
                      Pintura Pro
                    </p>

                    <p className="text-sm text-slate-500">
                      Taller
                      Automotriz
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  Av.
                  Corrientes
                  1234,
                  Buenos
                  Aires
                </p>

                <p className="text-sm text-slate-600">
                  Tel: +54 11
                  4000-0000
                </p>

                <p className="text-sm text-slate-600">
                  chapypinturapro@email.com
                </p>
              </div>
              
              <div className="sm:text-right">
                <p className="text-2xl font-bold text-slate-900">
                  PRESUPUESTO
                </p>

                <p className="text-slate-600 text-sm">
                  N° PRES-
                  {trabajo.id}
                </p>

                <p className="text-slate-600 text-sm mt-1">
                  Fecha:{' '}
                  {formatFecha(
                    new Date()
                      .toISOString()
                      .split(
                        'T'
                      )[0]
                  )}
                </p>

                <div className="mb-6">
  <h3 className="font-semibold">
    Datos del Cliente
  </h3>

  <p>{trabajo.vehiculo.cliente.nombre}</p>

  <p>{trabajo.vehiculo.cliente.telefono}</p>
</div>

<div className="mb-6">
  <h3 className="font-semibold">
    Datos del Vehículo
  </h3>

  <p>
    {trabajo.vehiculo.marca} {trabajo.vehiculo.modelo}
  </p>

  <p>{trabajo.vehiculo.patente}</p>
</div>
              </div>
            </div>

            {trabajo.tipo ===
              'Seguro' &&
              trabajo.seguro && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    Información
                    del Seguro
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">
                        Compañía
                      </p>

                      <p className="font-semibold text-slate-900">
                        {
                            seguro
                            ?.aseguradora
                            ?.nombre
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        N°
                        Siniestro
                      </p>

                      <p className="font-semibold text-slate-900">
                        {
                          seguro
                            ?.numero_siniestro
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Monto
                        Aprobado
                      </p>

                      <p className="font-semibold text-green-700">
                        {montoAprobado >
                        0
                          ? formatMonto(
                              montoAprobado
                            )
                          : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-2">
                <div className="flex justify-between">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatMonto(
                      subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    IVA
                    (21%)
                  </span>

                  <span>
                    {formatMonto(
                      iva
                    )}
                  </span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>
                    TOTAL
                  </span>

                  <span>
                    {formatMonto(
                      total
                    )}
                  </span>
                </div>

                {trabajo.tipo ===
                  'Seguro' &&
                  trabajo.seguro &&
                  montoAprobado >
                    0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <div className="flex justify-between text-sm font-semibold text-green-800">
                        <span>
                          Monto
                          cubierto
                          por
                          seguro
                        </span>

                        <span>
                          {formatMonto(
                            Math.min(
                              montoAprobado,
                              total
                            )
                          )}
                        </span>
                      </div>

                      {total >
                        montoAprobado && (
                        <div className="flex justify-between text-sm text-amber-700 mt-1">
                          <span>
                            Diferencia
                            a
                            cargo
                            del
                            cliente
                          </span>

                          <span>
                            {formatMonto(
                              total -
                                montoAprobado
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>

          <Button
            onClick={
              handlePrint
            }
          >
            <Printer className="size-4 mr-2" />
            Imprimir
            Presupuesto
          </Button>
        </div>
      </div>
    </div>
  );
}
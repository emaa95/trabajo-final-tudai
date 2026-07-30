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

type CategoriaItem = 'mano_obra' | 'mecanica' | 'repuestos';

export function PresupuestoModal({
  trabajo,
  onClose,
}: PresupuestoModalProps) {
  const printRef =
    useRef<HTMLDivElement>(null);

  const seguro =
    trabajo.seguro?.[0];

  // Agrupamos las tareas por categoría. Si una tarea no trae `categoria`,
  // cae por defecto en "Mano de Obra".
  const todosLosItems =
    trabajo.tareas?.map(
      (tarea) => ({
        descripcion: tarea.titulo,
        cantidad: 1,
        precioUnitario: tarea.costo,
        categoria:
          ((tarea as { categoria?: CategoriaItem })
            .categoria ??
            'mano_obra') as CategoriaItem,
      })
    ) ?? [];

  const itemsPorCategoria = (
    categoria: CategoriaItem
  ) =>
    todosLosItems.filter(
      (item) =>
        item.categoria === categoria
    );

  const sumar = (
    items: typeof todosLosItems
  ) =>
    items.reduce(
      (acc, item) =>
        acc +
        item.cantidad *
          item.precioUnitario,
      0
    );

  const manoDeObra =
    itemsPorCategoria('mano_obra');
  const mecanica =
    itemsPorCategoria('mecanica');
  const repuestos =
    itemsPorCategoria('repuestos');

  const totalManoDeObra =
    sumar(manoDeObra);
  const totalMecanica =
    sumar(mecanica);
  const totalRepuestos =
    sumar(repuestos);

  const totalPresupuesto =
    totalManoDeObra +
    totalMecanica +
    totalRepuestos;

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

  const SeccionItems = ({
    titulo,
    items,
    total,
  }: {
    titulo: string;
    items: typeof todosLosItems;
    total: number;
  }) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
        {titulo}
      </h3>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400 italic py-2">
          Sin ítems cargados
        </p>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100"
              >
                <td className="py-1.5 text-slate-700">
                  {item.descripcion}
                </td>

                <td className="py-1.5 text-right text-slate-700 w-32">
                  {formatMonto(
                    item.precioUnitario
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end mt-1">
        <div className="flex justify-between w-48 font-semibold text-slate-900">
          <span>TOTAL</span>
          <span>{formatMonto(total)}</span>
        </div>
      </div>
    </div>
  );

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
              onClick={handlePrint}
            >
              <Printer className="size-4 mr-2" />
              Imprimir
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div ref={printRef}>
            {/* Encabezado del taller, igual al del papel */}
            <div className="mb-6 pb-4 border-b-2 border-slate-900 text-center">
              <p className="font-bold text-slate-900 text-xl uppercase tracking-wide">
                C.A.D.I Taller de Chapa y Pintura
              </p>

              <p className="text-sm text-slate-700 mt-1">
                de Alexis Godoy
              </p>

              <p className="text-sm text-slate-600">
                CUIT 20425119436
              </p>

              <p className="text-sm text-slate-600">
                Santa Fe 1285 · Tancacha - Córdoba
              </p>

              <p className="text-sm text-slate-600">
                Tel: 03571-460039 / 15610862
              </p>
            </div>

            {/* Datos del solicitante / vehículo, en el formato del papel:
                Solicitante / Fecha, Dirección / Telefono, Veh. Marca y Mod / Dominio */}
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 mb-6">
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="px-3 py-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
                    Solicitante:
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {
                      trabajo.vehiculo
                        .cliente.nombre
                    }
                  </span>
                </div>

                <div className="px-3 py-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
                    Fecha:
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatFecha(
                      new Date()
                        .toISOString()
                        .split('T')[0]
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="px-3 py-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
                    Dirección:
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {trabajo.vehiculo.cliente.direccion ??
                      '—'}
                  </span>
                </div>

                <div className="px-3 py-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
                    Telefono:
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {
                      trabajo.vehiculo
                        .cliente.telefono
                    }
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="px-3 py-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
                    Veh. Marca y Mod:
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {trabajo.vehiculo.marca}{' '}
                    {trabajo.vehiculo.modelo}
                  </span>
                </div>

                <div className="px-3 py-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wide mr-1">
                    Dominio:
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {trabajo.vehiculo.patente}
                  </span>
                </div>
              </div>
            </div>

            {trabajo.tipo === 'Seguro' &&
              trabajo.seguro && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    Información del Seguro
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">
                        Compañía
                      </p>

                      <p className="font-semibold text-slate-900">
                        {
                          seguro?.aseguradora
                            ?.nombre
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        N° Siniestro
                      </p>

                      <p className="font-semibold text-slate-900">
                        {
                          seguro?.numero_siniestro
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Monto Aprobado
                      </p>

                      <p className="font-semibold text-green-700">
                        {montoAprobado > 0
                          ? formatMonto(
                              montoAprobado
                            )
                          : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Las tres secciones del papel */}
            <SeccionItems
              titulo="Mano de Obra"
              items={manoDeObra}
              total={totalManoDeObra}
            />

            <SeccionItems
              titulo="Mecánica"
              items={mecanica}
              total={totalMecanica}
            />

            <SeccionItems
              titulo="Repuestos"
              items={repuestos}
              total={totalRepuestos}
            />

            {/* Total general */}
            <div className="border-t-2 border-slate-900 pt-3 flex justify-end">
              <div className="flex justify-between w-64 text-lg font-bold text-slate-900">
                <span>
                  TOTAL PRESUPUESTO
                </span>
                <span>
                  {formatMonto(
                    totalPresupuesto
                  )}
                </span>
              </div>
            </div>

            {trabajo.tipo === 'Seguro' &&
              trabajo.seguro &&
              montoAprobado > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <div className="flex justify-between text-sm font-semibold text-green-800">
                    <span>
                      Monto cubierto por
                      seguro
                    </span>

                    <span>
                      {formatMonto(
                        Math.min(
                          montoAprobado,
                          totalPresupuesto
                        )
                      )}
                    </span>
                  </div>

                  {totalPresupuesto >
                    montoAprobado && (
                    <div className="flex justify-between text-sm text-amber-700 mt-1">
                      <span>
                        Diferencia a cargo
                        del cliente
                      </span>

                      <span>
                        {formatMonto(
                          totalPresupuesto -
                            montoAprobado
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}

            {/* Leyenda legal, igual a la del papel */}
            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              Los presupuestos están sujetos
              a ajustes sin previo aviso y
              tienen una validez de 15 días.
              Los mismos están calculados en
              base a repuestos originales y
              de no serlo puede variar el
              costo de mano de obra.
              <br />
              Los trabajos con repuestos no
              originales no tienen garantía.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>

          <Button onClick={handlePrint}>
            <Printer className="size-4 mr-2" />
            Imprimir Presupuesto
          </Button>
        </div>
      </div>
    </div>
  );
}
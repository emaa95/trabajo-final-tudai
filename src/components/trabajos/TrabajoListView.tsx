import { Link } from 'react-router';
import { Eye } from 'lucide-react';

import { Card, CardContent } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';

import {
  EstadoBadge,
  TipoBadge,
} from '../common/Badges';

import type {
  TrabajoDetalle,
} from '@/types';

interface TrabajoListViewProps {
  trabajos: TrabajoDetalle[];
}

export function TrabajoListView({
  trabajos,
}: TrabajoListViewProps) {
  const formatFecha = (
    fecha: string,
  ) =>
    new Date(
      fecha,
    ).toLocaleDateString(
      'es-AR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    );

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
      <div className="text-sm text-slate-600">
        Mostrando {trabajos.length} trabajo
        {trabajos.length !== 1 ? 's' : ''}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Vehículo
                  </TableHead>

                  <TableHead>
                    Cliente
                  </TableHead>

                  <TableHead>
                    Tipo
                  </TableHead>

                  <TableHead>
                    Estado
                  </TableHead>

                  <TableHead>
                    Ingreso
                  </TableHead>

                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {trabajos.map(
                  (trabajo) => (
                    <TableRow
                      key={trabajo.id}
                    >
                      <TableCell>
                        <div>
                          <div className="font-semibold">
                            {
                              trabajo
                                .vehiculo
                                .patente
                            }
                          </div>

                          <div className="text-sm text-slate-500">
                            {
                              trabajo
                                .vehiculo
                                .marca
                            }{' '}
                            {
                              trabajo
                                .vehiculo
                                .modelo
                            }
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="mt-1 truncate text-xs font-medium">
                            {
                              trabajo
                                .vehiculo
                                .cliente
                                .nombre
                            }
                          </p>

                          <div className="text-sm text-slate-500">
                            {
                              trabajo
                                .vehiculo
                                .cliente
                                .telefono
                            }
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <TipoBadge
                          tipo={
                            trabajo.tipo
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <EstadoBadge
                          estado={
                            trabajo.estado
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {formatFecha(
                          trabajo.fecha_ingreso,
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          to={`/trabajos/${trabajo.id}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="mr-2 size-4" />
                            Ver
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ),
                )}

                {trabajos.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No se encontraron trabajos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
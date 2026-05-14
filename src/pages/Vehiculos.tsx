import { Card, CardContent } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { vehiculos, getClienteById } from '../data';
import { Plus, User } from 'lucide-react';

export function Vehiculos() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vehículos</h1>
          <p className="text-slate-600 mt-1">
            Gestión de vehículos del taller ({vehiculos.length} registrados)
          </p>
        </div>
        <Button className="w-full lg:w-auto">
          <Plus className="size-4 mr-2" />
          Nuevo Vehículo
        </Button>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patente</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiculos.map((vehiculo) => {
                  const cliente = getClienteById(vehiculo.clienteId);
                  
                  return (
                    <TableRow key={vehiculo.id}>
                      <TableCell>
                        <div className="font-bold text-lg">{vehiculo.patente}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{vehiculo.marca}</div>
                      </TableCell>
                      <TableCell>{vehiculo.modelo}</TableCell>
                      <TableCell className="text-slate-600">
                        {vehiculo.año}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="size-4 rounded-full border border-slate-300"
                            style={{
                              backgroundColor: vehiculo.color.toLowerCase(),
                            }}
                          />
                          {vehiculo.color}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-slate-500" />
                          <span>{cliente?.nombre || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

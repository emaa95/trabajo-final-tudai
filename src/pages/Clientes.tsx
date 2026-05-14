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
import { clientes, getVehiculosByCliente } from '../data';
import { Plus, Phone, Mail, Car } from 'lucide-react';

export function Clientes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-1">
            Gestión de clientes del taller ({clientes.length} registrados)
          </p>
        </div>
        <Button className="w-full lg:w-auto">
          <Plus className="size-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vehículos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => {
                  const vehiculosCliente = getVehiculosByCliente(cliente.id);
                  
                  return (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-mono text-slate-500">
                        #{cliente.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{cliente.nombre}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="size-4" />
                          {cliente.telefono}
                        </div>
                      </TableCell>
                      <TableCell>
                        {cliente.email ? (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="size-4" />
                            {cliente.email}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="size-4 text-slate-500" />
                          <span className="font-semibold">
                            {vehiculosCliente.length}
                          </span>
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
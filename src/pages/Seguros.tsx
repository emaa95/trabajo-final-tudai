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
import { companiasSeguros, trabajos } from '../data';
import { Plus, Shield, TrendingUp } from 'lucide-react';

export function Seguros() {
  const getTrabajosActivosPorSeguro = (nombreSeguro: string) => {
  return trabajos.filter(
    t =>
      t.tipo === 'Seguro' &&
      t.seguro?.compania === nombreSeguro &&
      !['Entregado', 'Listo para entregar'].includes(t.estado)
  ).length;
};

  const getTrabajosFinalizadosPorSeguro = (nombreSeguro: string) => {
    return trabajos.filter(
      t => t.tipo === 'Seguro' && 
      t.seguro?.compania === nombreSeguro && 
      t.estado === 'Entregado'
    ).length;
  };

  const totalTrabajosSeguro = trabajos.filter(t => t.tipo === 'Seguro').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compañías de Seguros</h1>
          <p className="text-slate-600 mt-1">
            Gestión de seguros ({companiasSeguros.length} compañías registradas)
          </p>
        </div>
        <Button className="w-full lg:w-auto">
          <Plus className="size-4 mr-2" />
          Nueva Compañía
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total de seguros</p>
                <p className="text-3xl font-bold mt-2">{companiasSeguros.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Trabajos por seguro</p>
                <p className="text-3xl font-bold mt-2">{totalTrabajosSeguro}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">% de trabajos</p>
                <p className="text-3xl font-bold mt-2">
                  {Math.round((totalTrabajosSeguro / trabajos.length) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Compañía</TableHead>
                  <TableHead>Trabajos Activos</TableHead>
                  <TableHead>Trabajos Finalizados</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companiasSeguros.map((seguro) => {
                  const activos = getTrabajosActivosPorSeguro(seguro.nombre);
                  const finalizados = getTrabajosFinalizadosPorSeguro(seguro.nombre);
                  const total = activos + finalizados;
                  
                  return (
                    <TableRow key={seguro.id}>
                      <TableCell className="font-mono text-slate-500">
                        #{seguro.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="size-5 text-blue-600" />
                          <span className="font-semibold">{seguro.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-orange-600">
                          {activos}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {finalizados}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-lg">{total}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Trabajos
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

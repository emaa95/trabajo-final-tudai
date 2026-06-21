import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Clock,
  Wrench,
  Paintbrush,
  CheckCircle,
  TrendingUp,
  HardHat,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useTrabajos } from '@/hooks/useTrabajos';
import { useClientes } from '@/hooks/useClientes';
import { useEmpleados } from '@/hooks/useEmpleados';
import { useVehiculos } from '@/hooks/useVehiculos';

export function Home() {
  const { currentUser } = useAuth();

  const { trabajos } = useTrabajos();
  const { clientes } = useClientes();
  const { empleados } = useEmpleados();
  const { vehiculos } = useVehiculos();

  const trabajosPendientes = trabajos.filter(
    (t) => t.estado === 'Pendiente'
  ).length;

  const trabajosEnReparacion = trabajos.filter(
    (t) => t.estado === 'En reparación'
  ).length;

  const trabajosEnPintura = trabajos.filter(
    (t) => t.estado === 'En pintura'
  ).length;

  const trabajosListosParaEntregar = trabajos.filter(
    (t) => t.estado === 'Listo para entregar'
  ).length;

  const trabajosEntregados = trabajos.filter(
    (t) => t.estado === 'Entregado'
  ).length;

  const trabajosFinalizados =
    trabajosListosParaEntregar +
    trabajosEntregados;

  const trabajosActivos = trabajos.filter(
    (t) =>
      t.estado !== 'Entregado' &&
      t.estado !== 'Cancelada'
  ).length;

  const empleadosActivos = empleados.filter(
    (e) => e.activo
  ).length;

  const trabajosSeguro = trabajos.filter(
    (t) => t.tipo === 'Seguro'
  ).length;

  const trabajosParticular = trabajos.filter(
    (t) => t.tipo === 'Particular'
  ).length;

  const totalTipos =
    trabajosSeguro + trabajosParticular;

  const porcentajeSeguro =
    totalTipos > 0
      ? (trabajosSeguro / totalTipos) * 100
      : 0;

  const porcentajeParticular =
    totalTipos > 0
      ? (trabajosParticular / totalTipos) * 100
      : 0;

  const actividadReciente = [...trabajos]
    .sort(
      (a, b) =>
        new Date(
          b.fecha_creacion ?? b.fecha_ingreso
        ).getTime() -
        new Date(
          a.fecha_creacion ?? a.fecha_ingreso
        ).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: 'Pendientes',
      value: trabajosPendientes,
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      title: 'En reparación',
      value: trabajosEnReparacion,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'En pintura',
      value: trabajosEnPintura,
      icon: Paintbrush,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Finalizados',
      value: trabajosFinalizados,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              Bienvenido,
              <span className="text-blue-300">
                {' '}
                {currentUser?.empleado.nombre}
              </span>{' '}
              👋
            </h1>

            <p className="text-slate-300 text-sm mt-2">
              Resumen general del taller
            </p>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {trabajosActivos}
              </div>

              <div className="text-xs text-slate-400">
                Trabajos activos
              </div>
            </div>

            <div className="w-px bg-slate-700" />

            <div className="text-center">
              <div className="text-2xl font-bold">
                {clientes.length}
              </div>

              <div className="text-xs text-slate-400">
                Clientes
              </div>
            </div>

            <div className="w-px bg-slate-700" />

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <HardHat className="size-4 text-emerald-400" />

                <div className="text-2xl font-bold">
                  {empleadosActivos}
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Empleados
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">
                      {stat.title}
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${stat.bgColor}`}
                  >
                    <Icon
                      className={`size-6 ${stat.color}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trabajos por tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Trabajos por tipo
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Seguro</span>

                <span className="font-bold">
                  {trabajosSeguro}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Particular</span>

                <span className="font-bold">
                  {trabajosParticular}
                </span>
              </div>
            </div>

            <div className="mt-4 h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600"
                style={{
                  width: `${porcentajeSeguro}%`,
                }}
              />

              <div
                className="bg-green-600"
                style={{
                  width: `${porcentajeParticular}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen general</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between border-b py-2">
                <span>Total trabajos</span>

                <span className="font-bold">
                  {trabajos.length}
                </span>
              </div>

              <div className="flex justify-between border-b py-2">
                <span>Clientes</span>

                <span className="font-bold">
                  {clientes.length}
                </span>
              </div>

              <div className="flex justify-between border-b py-2">
                <span>Vehículos</span>

                <span className="font-bold">
                  {vehiculos.length}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span>Activos</span>

                <span className="font-bold text-blue-600">
                  {trabajosActivos}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {actividadReciente.map((trabajo) => (
              <div
                key={trabajo.id}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <p className="font-semibold">
                  {trabajo.vehiculo?.patente} -{' '}
                  {trabajo.vehiculo?.marca}{' '}
                  {trabajo.vehiculo?.modelo}
                </p>

                <p className="text-sm text-slate-600">
                  {trabajo.vehiculo?.cliente.nombre}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-500">
                    {trabajo.trabajos_solicitados
                      .slice(0, 2)
                      .join(', ')}
                  </p>

                  <span className="text-xs font-medium text-blue-600">
                    {trabajo.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
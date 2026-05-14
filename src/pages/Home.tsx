import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Clock,
  Wrench,
  Paintbrush,
  CheckCircle,
  TrendingUp,
  HardHat,
} from 'lucide-react';

export function Home() {
  // mock data simple
  const currentUser = { nombre: 'Juan' };

  const stats = [
    {
      title: 'En espera',
      value: 4,
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      title: 'En reparación',
      value: 6,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'En pintura',
      value: 3,
      icon: Paintbrush,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Finalizados',
      value: 12,
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
              Bienvenido, <span className="text-blue-300">{currentUser.nombre}</span> 👋
            </h1>
            <p className="text-slate-300 text-sm mt-2">
              Resumen general del taller
            </p>
          </div>

          

          {/* Quick stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">13</div>
              <div className="text-xs text-slate-400">Trabajos activos</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-bold">25</div>
              <div className="text-xs text-slate-400">Clientes</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <HardHat className="size-4 text-emerald-400" />
                <div className="text-2xl font-bold">5</div>
              </div>
              <div className="text-xs text-slate-400">Empleados</div>
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
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos */}
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
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between">
                <span>Particular</span>
                <span className="font-bold">5</span>
              </div>
            </div>

            <div className="mt-4 h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 w-2/3" />
              <div className="bg-green-600 w-1/3" />
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
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span>Clientes</span>
                <span className="font-bold">25</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span>Vehículos</span>
                <span className="font-bold">18</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Activos</span>
                <span className="font-bold text-blue-600">13</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <p className="font-semibold">ABC123 - Toyota Corolla</p>
                <p className="text-sm text-slate-600">Cliente Ejemplo</p>
                <p className="text-xs text-slate-500 mt-1">
                  Golpe frontal leve...
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
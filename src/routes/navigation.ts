import {
  Home,
  Briefcase,
  Users,
  Car,
  Shield,
  HardHat,
  Wrench,
} from 'lucide-react';

export const navigation = [
  {
    name: 'Inicio',
    to: '/',
    icon: Home,
    end:true
  },
  {
    name: 'Trabajos',
    to: '/trabajos',
    icon: Briefcase,
  },
  {
    name: 'Servicios',
    to: '/servicios',
    icon: Wrench,
  },
  {
    name: 'Clientes',
    to: '/clientes',
    icon: Users,
  },
  {
    name: 'Vehículos',
    to: '/vehiculos',
    icon: Car,
  },
  {
    name: 'Seguros',
    to: '/seguros',
    icon: Shield,
  },
  {
    name: 'Empleados',
    to: '/empleados',
    icon: HardHat,
  },
];
import type { Cliente, Vehiculo, Trabajo, EstadoTrabajo, Empleado } from './types';

export const clientes: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    dni: '32.456.789',
    telefono: '+54 11 4567-8901',
    email: 'juan@email.com'
  },
  {
    id: '2',
    nombre: 'María García',
    dni: '28.123.456',
    telefono: '+54 11 4567-8902',
    email: 'maria@email.com'
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    dni: '30.987.654',
    telefono: '+54 11 4567-8903',
    email: 'carlos@email.com'
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    dni: '27.654.321',
    telefono: '+54 11 4567-8904',
    email: 'ana@email.com'
  },
  {
    id: '5',
    nombre: 'Pedro López',
    dni: '35.741.258',
    telefono: '+54 11 4567-8905',
    email: 'pedro@email.com'
  },
  {
    id: '6',
    nombre: 'Laura Fernández',
    dni: '29.852.147',
    telefono: '+54 11 4567-8906',
    email: 'laura@email.com'
  },
];

export const vehiculos: Vehiculo[] = [
  { id: '1', patente: 'AA123BC', modelo: 'Corolla', marca: 'Toyota', año: 2020, color: 'Blanco', clienteId: '1' },
  { id: '2', patente: 'AB456CD', modelo: 'Golf', marca: 'Volkswagen', año: 2019, color: 'Negro', clienteId: '2' },
  { id: '3', patente: 'AC789EF', modelo: 'Focus', marca: 'Ford', año: 2021, color: 'Gris', clienteId: '3' },
  { id: '4', patente: 'AD012GH', modelo: 'Civic', marca: 'Honda', año: 2018, color: 'Rojo', clienteId: '4' },
  { id: '5', patente: 'AE345IJ', modelo: 'Cruze', marca: 'Chevrolet', año: 2020, color: 'Azul', clienteId: '5' },
  { id: '6', patente: 'AF678KL', modelo: 'Onix', marca: 'Chevrolet', año: 2022, color: 'Blanco', clienteId: '6' },
  { id: '7', patente: 'AG901MN', modelo: 'Etios', marca: 'Toyota', año: 2019, color: 'Plata', clienteId: '1' },
  { id: '8', patente: 'AH234OP', modelo: '208', marca: 'Peugeot', año: 2021, color: 'Negro', clienteId: '2' },
];

export const companiasSeguros = [
  { id: '1', nombre: 'La Caja Seguros' },
  { id: '2', nombre: 'Sancor Seguros' },
  { id: '3', nombre: 'Rivadavia Seguros' },
  { id: '4', nombre: 'Federación Patronal' },
  { id: '5', nombre: 'Seguros Bernardino Rivadavia' },
];

export const trabajos: Trabajo[] = [
  {
    id: '1',
    vehiculoId: '1',
    clienteId: '1',
    tipo: 'Seguro',
    estado: 'En reparación',
    fechaIngreso: '2026-03-20',
    notas: 'Cliente solicita reparación urgente. Vehículo de trabajo.',
    tareas: [
      {
        id: 't1',
        titulo: 'Desarme frontal',
        realizada: true,
        costo: 25000,
      },
      {
        id: 't2',
        titulo: 'Cambio de paragolpes',
        realizada: true,
        costo: 60000,
      },
      {
        id: 't3',
        titulo: 'Pintura frontal',
        realizada: false,
        costo: 45000,
      },
    ],
    seguro: {
      id: 's1',
      compania: 'La Caja Seguros',
      numeroSiniestro: 'LC-2026-001234',
      estado: 'Aprobado',
      montoAprobado: 150000,
    },
    imagenes: {
      antes: [
        '/images/trabajos/1/antes-1.jpg',
      ],
      despues: [],
    },
  },

  {
    id: '2',
    vehiculoId: '2',
    clienteId: '2',
    tipo: 'Particular',
    estado: 'Pendiente',
    fechaIngreso: '2026-03-24',
    notas: 'Cliente consulta por presupuesto antes de aprobar.',
    tareas: [
      {
        id: 't4',
        titulo: 'Pulido de capó',
        realizada: false,
        costo: 18000,
      },
      {
        id: 't5',
        titulo: 'Pintura localizada',
        realizada: false,
        costo: 35000,
      },
    ],
    imagenes: {
      antes: [
        '/images/trabajos/2/antes-1.jpg',
      ],
      despues: [],
    },
  },

  {
    id: '3',
    vehiculoId: '3',
    clienteId: '3',
    tipo: 'Seguro',
    estado: 'En pintura',
    fechaIngreso: '2026-03-18',
    tareas: [
      {
        id: 't6',
        titulo: 'Cambio de paragolpes trasero',
        realizada: true,
        costo: 70000,
      },
      {
        id: 't7',
        titulo: 'Preparación de superficie',
        realizada: true,
        costo: 15000,
      },
      {
        id: 't8',
        titulo: 'Pintura de portón',
        realizada: false,
        costo: 50000,
      },
    ],
    seguro: {
      id: 's2',
      compania: 'Sancor Seguros',
      numeroSiniestro: 'SAN-2026-005678',
      estado: 'Aprobado',
      montoAprobado: 200000,
    },
    imagenes: {
      antes: [
        '/images/trabajos/3/antes-1.jpg',
      ],
      despues: [],
    },
  },

  {
    id: '4',
    vehiculoId: '4',
    clienteId: '4',
    tipo: 'Particular',
    estado: 'Entregado',
    fechaIngreso: '2026-03-10',
    notas: 'Trabajo completado satisfactoriamente.',
    tareas: [
      {
        id: 't9',
        titulo: 'Desabollado PDR',
        realizada: true,
        costo: 40000,
      },
      {
        id: 't10',
        titulo: 'Control de calidad',
        realizada: true,
        costo: 5000,
      },
    ],
    imagenes: {
      antes: [
        '/images/trabajos/4/antes-1.jpg',
      ],
      despues: [
        '/images/trabajos/4/despues-1.jpg',
      ],
    },
  },

  {
    id: '5',
    vehiculoId: '5',
    clienteId: '5',
    tipo: 'Seguro',
    estado: 'Pausada',
    fechaIngreso: '2026-03-25',
    notas: 'Esperando aprobación del seguro.',
    tareas: [
      {
        id: 't11',
        titulo: 'Enderezado de guardabarros',
        realizada: false,
        costo: 22000,
      },
      {
        id: 't12',
        titulo: 'Pintura lateral',
        realizada: false,
        costo: 48000,
      },
    ],
    seguro: {
      id: 's3',
      compania: 'Rivadavia Seguros',
      numeroSiniestro: 'RIV-2026-003456',
      estado: 'Pendiente',
      montoAprobado: 0,
    },
    imagenes: {
      antes: [
        '/images/trabajos/5/antes-1.jpg',
      ],
      despues: [],
    },
  },

  {
    id: '6',
    vehiculoId: '6',
    clienteId: '6',
    tipo: 'Particular',
    estado: 'En reparación',
    fechaIngreso: '2026-03-22',
    notas: 'Mantener pintura original.',
    tareas: [
      {
        id: 't13',
        titulo: 'Lijado lateral',
        realizada: true,
        costo: 12000,
      },
      {
        id: 't14',
        titulo: 'Masillado',
        realizada: true,
        costo: 10000,
      },
      {
        id: 't15',
        titulo: 'Pintura de puertas',
        realizada: false,
        costo: 55000,
      },
    ],
    imagenes: {
      antes: [
        '/images/trabajos/6/antes-1.jpg',
      ],
      despues: [],
    },
  },

  {
    id: '7',
    vehiculoId: '7',
    clienteId: '1',
    tipo: 'Particular',
    estado: 'En pintura',
    fechaIngreso: '2026-03-19',
    tareas: [
      {
        id: 't16',
        titulo: 'Lijado completo',
        realizada: true,
        costo: 30000,
      },
      {
        id: 't17',
        titulo: 'Aplicación de primer',
        realizada: true,
        costo: 20000,
      },
      {
        id: 't18',
        titulo: 'Pintura general',
        realizada: false,
        costo: 90000,
      },
    ],
    imagenes: {
      antes: [
        '/images/trabajos/7/antes-1.jpg',
      ],
      despues: [],
    },
  },

  {
    id: '8',
    vehiculoId: '8',
    clienteId: '2',
    tipo: 'Seguro',
    estado: 'Listo para entregar',
    fechaIngreso: '2026-03-15',
    notas: 'Vehículo listo. Esperando retiro.',
    tareas: [
      {
        id: 't19',
        titulo: 'Reparación de granizo',
        realizada: true,
        costo: 80000,
      },
      {
        id: 't20',
        titulo: 'Pintura de techo',
        realizada: true,
        costo: 45000,
      },
      {
        id: 't21',
        titulo: 'Pulido final',
        realizada: true,
        costo: 15000,
      },
    ],
    seguro: {
      id: 's4',
      compania: 'Federación Patronal',
      numeroSiniestro: 'FP-2026-007890',
      estado: 'Aprobado',
      montoAprobado: 180000,
    },
    imagenes: {
      antes: [
        '/images/trabajos/8/antes-1.jpg',
      ],
      despues: [
        '/images/trabajos/8/despues-1.jpg',
      ],
    },
  },
];

export const getClienteById = (id: string): Cliente | undefined => {
  return clientes.find(c => c.id === id);
};

export const getVehiculoById = (id: string): Vehiculo | undefined => {
  return vehiculos.find(v => v.id === id);
};

export const getTrabajosByEstado = (estado: EstadoTrabajo): Trabajo[] => {
  return trabajos.filter(t => t.estado === estado);
};

export const getVehiculosByCliente = (clienteId: string): Vehiculo[] => {
  return vehiculos.filter(v => v.clienteId === clienteId);
};

export const empleados: Empleado[] = [
  {
    id: '1',
    nombre: 'Roberto',
    apellido: 'Sánchez',
    dni: '28.456.789',
    telefono: '+54 11 4567-1001',
    email: 'roberto.sanchez@tallerpro.com',
    rol: 'Chapista',
    activo: true,
    fechaIngreso: '2019-03-15',
  },
  {
    id: '2',
    nombre: 'Alejandro',
    apellido: 'Gómez',
    dni: '31.234.567',
    telefono: '+54 11 4567-1002',
    email: 'alejandro.gomez@tallerpro.com',
    rol: 'Pintor',
    activo: true,
    fechaIngreso: '2020-07-01',
  },
  {
    id: '3',
    nombre: 'Marcelo',
    apellido: 'Torres',
    dni: '25.678.901',
    telefono: '+54 11 4567-1003',
    rol: 'Chapista',
    activo: true,
    fechaIngreso: '2018-11-20',
  },
  {
    id: '4',
    nombre: 'Diego',
    apellido: 'Ramírez',
    dni: '33.789.012',
    telefono: '+54 11 4567-1004',
    email: 'diego.ramirez@tallerpro.com',
    rol: 'Mecánico',
    activo: true,
    fechaIngreso: '2021-02-10',
  },
  {
    id: '5',
    nombre: 'Valeria',
    apellido: 'Moreno',
    dni: '29.345.678',
    telefono: '+54 11 4567-1005',
    email: 'valeria.moreno@tallerpro.com',
    rol: 'Administrativo',
    activo: true,
    fechaIngreso: '2022-05-03',
  },
  {
    id: '6',
    nombre: 'Hernán',
    apellido: 'Díaz',
    dni: '22.901.234',
    telefono: '+54 11 4567-1006',
    rol: 'Pintor',
    activo: false,
    fechaIngreso: '2017-08-14',
  },
];
import { createBrowserRouter }
  from 'react-router-dom';

import { Layout }
  from '../components/layout/Layout';

import { ProtectedRoute }
  from '@/components/auth/ProtectedRoute';

import { Auth }
  from '../pages/Auth';

import { Home }
  from '../pages/Home';

import { Trabajos }
  from '../pages/Trabajos';

import { Empleados }
  from '@/pages/Empleados';

import { Seguros }
  from '@/pages/Seguros';

import { Vehiculos }
  from '@/pages/Vehiculos';

import { Clientes }
  from '@/pages/Clientes';
import { TrabajoFormV2 } from '@/components/forms/trabajo-form-v2/TrabajoFormV2';
import { TrabajoDetalle } from '@/components/trabajos/TrabajoDetalle';

const router =
  createBrowserRouter([
    // PUBLICA
    {
      path: '/auth',
      element: <Auth />,
    },

    // PRIVADAS
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),

      children: [
        {
          index: true,
          element: <Home />,
        },

        {
          path: '/trabajos',
          element: <Trabajos />,
        },

        {
          path:
            '/trabajos/nuevo',

          element:
            <TrabajoFormV2 />,
        },

        {
          path: '/empleados',
          element: <Empleados />,
        },

        {
          path: '/seguros',
          element: <Seguros />,
        },

        {
          path: '/vehiculos',
          element: <Vehiculos />,
        },

        {
          path: '/clientes',
          element: <Clientes />,
        },

        {
  path: '/trabajos/:id',
  element: <TrabajoDetalle />,
},
      ],
    },
  ]);

export default router;
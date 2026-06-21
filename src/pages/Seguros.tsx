import { useEffect, useState } from 'react';

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
import { Plus, Shield } from 'lucide-react';

import { useAseguradoras } from '@/hooks/useAseguradoras';
import { ModalAseguradora } from '../components/modals/ModalAseguradora';

export function Seguros() {
  const {
    aseguradoras,
    fetchAseguradoras,
  } = useAseguradoras();

  const [open, setOpen] = useState(false);

  // ─────────────────────────────
  // Load estable (evita doble fetch / race conditions)
  // ─────────────────────────────
  useEffect(() => {
    let alive = true;

    const load = async () => {
      await fetchAseguradoras();

      if (!alive) return;
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  // ─────────────────────────────
  // Render
  // ─────────────────────────────
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Compañías de Seguros
          </h1>

          <p className="text-slate-600 mt-1">
            {aseguradoras.length} aseguradoras registradas
          </p>
        </div>

        <Button
          className="w-full lg:w-auto"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4 mr-2" />
          Nueva Aseguradora
        </Button>

      </div>

      {/* TABLA */}
      <Card>
        <CardContent className="p-0">

          <div className="overflow-x-auto">

            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>CUIT</TableHead>
                  <TableHead>Contacto</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {aseguradoras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500 py-6">
                      No hay aseguradoras registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  aseguradoras.map((a) => (
                    <TableRow key={a.id}>

                      <TableCell className="font-mono text-slate-500">
                        #{a.id.slice(0, 6)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="size-5 text-blue-600" />
                          <span className="font-semibold">
                            {a.nombre}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {a.cuit ?? '-'}
                      </TableCell>

                      <TableCell>
                        <div className="text-sm text-slate-600">
                          {a.telefono && <div>{a.telefono}</div>}
                          {a.email && <div>{a.email}</div>}
                        </div>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>

          </div>

        </CardContent>
      </Card>

      {/* MODAL */}
      <ModalAseguradora
        open={open}
        onClose={() => setOpen(false)}
      />

    </div>
  );
}
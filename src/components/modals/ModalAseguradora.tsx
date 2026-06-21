import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAseguradoras } from '@/hooks/useAseguradoras';

interface ModalAseguradoraProps {
  open: boolean;
  onClose: () => void;
}

export function ModalAseguradora({
  open,
  onClose,
}: ModalAseguradoraProps) {
  const { addAseguradora } = useAseguradoras();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    cuit: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) return;

    try {
      setLoading(true);

      await addAseguradora({
        nombre: form.nombre,
        telefono: form.telefono || undefined,
        email: form.email || undefined,
        direccion: form.direccion || undefined,
        cuit: form.cuit || undefined,
      });

      setForm({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        cuit: '',
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            Nueva Aseguradora
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* NOMBRE */}
          <div className="space-y-1">
            <Label>Nombre *</Label>
            <Input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Sancor Seguros"
            />
          </div>

          {/* CUIT */}
          <div className="space-y-1">
            <Label>CUIT</Label>
            <Input
              name="cuit"
              value={form.cuit}
              onChange={handleChange}
              placeholder="XX-XXXXXXXX-X"
            />
          </div>

          {/* TEL */}
          <div className="space-y-1">
            <Label>Teléfono</Label>
            <Input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Ej: 3511234567"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ej: contacto@aseguradora.com"
            />
          </div>

          {/* DIRECCION */}
          <div className="space-y-1">
            <Label>Dirección</Label>
            <Input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Ej: Av. Colón 123"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Crear'}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}
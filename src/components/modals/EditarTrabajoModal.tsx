import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditarTrabajoModalProps {
  open: boolean;
  onClose: () => void;
}

export function EditarTrabajoModal({
  open,
  onClose,
}: EditarTrabajoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Orden de Trabajo</DialogTitle>
        </DialogHeader>

        <div className="py-8 text-center text-slate-500">
          Próximamente se mostrará aquí el formulario de edición.
        </div>
      </DialogContent>
    </Dialog>
  );
}
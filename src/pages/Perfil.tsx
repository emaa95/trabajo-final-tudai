import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";

import { PerfilHeader } from "@/components/perfil/PerfilHeader";
import { PerfilCard } from "@/components/perfil/PerfilCard";
import { SeguridadCard } from "@/components/perfil/SeguridadCard";
import { CuentaCard } from "@/components/perfil/CuentaCard";

export default function Perfil() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Perfil"
        description="Administra tu información personal y la seguridad de tu cuenta."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <PerfilHeader currentUser={currentUser} />

        <div className="lg:col-span-2">
          <PerfilCard currentUser={currentUser} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SeguridadCard />

        <CuentaCard currentUser={currentUser} />
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";

import { useTrabajos } from "@/hooks/useTrabajos";
import { useClientes } from "@/hooks/useClientes";
import { useEmpleados } from "@/hooks/useEmpleados";

export function Layout() {
  const { fetchTrabajos } = useTrabajos();
  const { fetchClientes } = useClientes();
  const { fetchEmpleados } = useEmpleados();

  useEffect(() => {
    fetchTrabajos();
    fetchClientes();
    fetchEmpleados();
  }, [fetchTrabajos, fetchClientes, fetchEmpleados]);

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Car, LogIn, UserPlus } from "lucide-react";
import { LoginForm } from "@/components/forms/auth/LoginForm";
import { RegisterForm } from "@/components/forms/auth/RegisterForm";

type Tab = "login" | "register";

export function Auth() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-blue-600 rounded-2xl shadow-xl mb-4">
            <Car className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TallerPro</h1>
          <p className="text-slate-400 mt-1">
            Sistema de Gestión · Chapa y Pintura
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                tab === "login"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <LogIn className="size-4" />
              Iniciar Sesión
            </button>

            <button
              onClick={() => setTab("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                tab === "register"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <UserPlus className="size-4" />
              Registrarse
            </button>
          </div>

          {tab === "login" && <LoginForm />}
          {tab === "register" && <RegisterForm />}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 TallerPro · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
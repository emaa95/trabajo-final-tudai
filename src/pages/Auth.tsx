import { useState } from "react";

import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";

import type { RegisterForm } from "@/types";

import {
  Car,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
  LogIn,
  AlertCircle,
} from "lucide-react";

type Tab = "login" | "register";

interface LoginForm {
  email: string;
  password: string;
}

export function Auth() {
  const { login, register } = useAuth();

  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("login");

  // =========================
  // LOGIN
  // =========================

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);

  const [showLoginPass, setShowLoginPass] = useState(false);

  // =========================
  // REGISTER
  // =========================

  const [regForm, setRegForm] = useState<RegisterForm>({
    nombre: "",
    apellido: "",

    dni: "",
    telefono: "",

    email: "",

    password: "",
    confirmPassword: "",
    taller_nombre: "",
    taller_direccion: "",
    taller_telefono: "",
  });

  const [regErrors, setRegErrors] = useState<
    Partial<
      RegisterForm & {
        general: string;
      }
    >
  >({});

  const [regLoading, setRegLoading] = useState(false);

  const [showRegPass, setShowRegPass] = useState(false);

  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const [regSuccess, setRegSuccess] = useState(false);

  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  // =========================
  // LOGIN HANDLER
  // =========================

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoginError("");

    if (!loginForm.email || !loginForm.password) {
      setLoginError("Completá todos los campos.");

      return;
    }

    setLoginLoading(true);

    const result = await login(loginForm.email, loginForm.password);

    if (result.ok) {
      navigate("/");
    } else {
      setLoginError(result.error ?? "Error al iniciar sesión.");
    }

    setLoginLoading(false);
  }

  // =========================
  // REGISTER VALIDATION
  // =========================

  function validateStep1(): boolean {
    const e: Partial<
      RegisterForm & {
        general: string;
      }
    > = {};

    if (!regForm.nombre.trim()) {
      e.nombre = "El nombre es requerido.";
    }

    if (!regForm.apellido.trim()) {
      e.apellido = "El apellido es requerido.";
    }

    if (!regForm.dni.trim()) {
      e.dni = "El DNI es requerido.";
    }

    if (!regForm.telefono.trim()) {
      e.telefono = "El teléfono es requerido.";
    }

    if (
      !regForm.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)
    ) {
      e.email = "Ingresá un email válido.";
    }

    if (regForm.password.length < 6) {
      e.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (regForm.password !== regForm.confirmPassword) {
      e.confirmPassword = "Las contraseñas no coinciden.";
    }

    setRegErrors(e);

    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Partial<
      RegisterForm & {
        general: string;
      }
    > = {};

    if (!regForm.taller_nombre.trim()) {
      e.taller_nombre = "El nombre del taller es requerido.";
    }

    if (!regForm.taller_direccion.trim()) {
      e.taller_direccion = "La dirección es requerida.";
    }

    if (!regForm.taller_telefono.trim()) {
      e.taller_telefono = "El teléfono es requerido.";
    }

    setRegErrors(e);

    return Object.keys(e).length === 0;
  }

  // =========================
  // REGISTER HANDLER
  // =========================

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setRegErrors({});

    setRegSuccess(false);

    if (!validateStep2()) {
      return;
    }

    setRegLoading(true);

    const result = await register({
      nombre: regForm.nombre,
      apellido: regForm.apellido,

      dni: regForm.dni,
      telefono: regForm.telefono,

      email: regForm.email,

      password: regForm.password,

      taller_nombre: regForm.taller_nombre,

      taller_direccion: regForm.taller_direccion,

      taller_telefono: regForm.taller_telefono,
    });

    if (result.ok) {
      setRegSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setRegErrors({
        general: result.error ?? "Error al registrar usuario.",
      });
    }

    setRegLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-blue-600 rounded-2xl shadow-xl mb-4">
            <Car className="size-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">TallerPro</h1>

          <p className="text-slate-400 mt-1">
            Sistema de Gestión · Chapa y Pintura
          </p>
        </div>

        {/* Card */}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}

          <div className="flex border-b border-slate-100">
            <button
              onClick={() => {
                setTab("login");
                setLoginError("");
              }}
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
              onClick={() => {
                setTab("register");

                setRegisterStep(1);

                setRegErrors({});

                setRegSuccess(false);
              }}
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

          {/* LOGIN */}

          {tab === "login" && (
            <form onSubmit={handleLogin} className="p-8 space-y-5">
              <div className="flex items-center gap-2 text-blue-700">
                <ShieldCheck className="size-5" />

                <h2 className="font-semibold">Acceso al Sistema</h2>
              </div>

              <p className="text-slate-600 text-sm">
                Ingresá con tu cuenta para acceder al sistema.
              </p>

              {loginError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />

                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="admin@tallerpro.com"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      email: e.target.value,
                    })
                  }
                  className={inputCls(false)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>

                <div className="relative">
                  <input
                    type={showLoginPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        password: e.target.value,
                      })
                    }
                    className={`${inputCls(false)} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPass ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="size-4" />
                )}

                {loginLoading ? "Ingresando..." : "Ingresar al Sistema"}
              </button>
            </form>
          )}

          {/* REGISTER */}

          {tab === "register" && (
            <form onSubmit={handleRegister} className="p-8 space-y-4">
              <div className="flex items-center gap-2 text-blue-700">
                <ShieldCheck className="size-5" />

                <h2 className="font-semibold">Crear Cuenta</h2>
              </div>

              <p className="text-slate-600 text-sm">
                Registrate para crear un nuevo taller.
              </p>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div
                    className={`h-2 flex-1 rounded-full ${
                      registerStep >= 1 ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />

                  <div
                    className={`h-2 flex-1 rounded-full ${
                      registerStep >= 2 ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />
                </div>

                <p className="text-xs text-slate-500">
                  Paso {registerStep} de 2
                </p>
              </div>

              {regErrors.general && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />

                  {regErrors.general}
                </div>
              )}

              {regSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
                  Cuenta creada correctamente.
                </div>
              )}


              {registerStep === 1 && (
  <>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Nombre
        </label>

        <input
          type="text"
          value={regForm.nombre}
          onChange={(e) =>
            setRegForm({
              ...regForm,
              nombre: e.target.value,
            })
          }
          className={inputCls(
            !!regErrors.nombre
          )}
        />

        {regErrors.nombre && (
          <p className="text-xs text-red-500">
            {regErrors.nombre}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Apellido
        </label>

        <input
          type="text"
          value={regForm.apellido}
          onChange={(e) =>
            setRegForm({
              ...regForm,
              apellido: e.target.value,
            })
          }
          className={inputCls(
            !!regErrors.apellido
          )}
        />

        {regErrors.apellido && (
          <p className="text-xs text-red-500">
            {regErrors.apellido}
          </p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          DNI
        </label>

        <input
          type="text"
          value={regForm.dni}
          onChange={(e) =>
            setRegForm({
              ...regForm,
              dni: e.target.value,
            })
          }
          className={inputCls(
            !!regErrors.dni
          )}
        />

        {regErrors.dni && (
          <p className="text-xs text-red-500">
            {regErrors.dni}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Teléfono
        </label>

        <input
          type="text"
          value={regForm.telefono}
          onChange={(e) =>
            setRegForm({
              ...regForm,
              telefono:
                e.target.value,
            })
          }
          className={inputCls(
            !!regErrors.telefono
          )}
        />

        {regErrors.telefono && (
          <p className="text-xs text-red-500">
            {regErrors.telefono}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Email
      </label>

      <input
        type="email"
        value={regForm.email}
        onChange={(e) =>
          setRegForm({
            ...regForm,
            email: e.target.value,
          })
        }
        className={inputCls(
          !!regErrors.email
        )}
      />

      {regErrors.email && (
        <p className="text-xs text-red-500">
          {regErrors.email}
        </p>
      )}
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Contraseña
      </label>

      <div className="relative">
        <input
          type={
            showRegPass
              ? 'text'
              : 'password'
          }
          value={regForm.password}
          onChange={(e) =>
            setRegForm({
              ...regForm,
              password:
                e.target.value,
            })
          }
          className={`${inputCls(
            !!regErrors.password
          )} pr-10`}
        />

        <button
          type="button"
          onClick={() =>
            setShowRegPass(
              !showRegPass
            )
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          {showRegPass ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      <PasswordStrength
        password={regForm.password}
      />

      {regErrors.password && (
        <p className="text-xs text-red-500">
          {regErrors.password}
        </p>
      )}
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Confirmar contraseña
      </label>

      <div className="relative">
        <input
          type={
            showRegConfirm
              ? 'text'
              : 'password'
          }
          value={
            regForm.confirmPassword
          }
          onChange={(e) =>
            setRegForm({
              ...regForm,
              confirmPassword:
                e.target.value,
            })
          }
          className={`${inputCls(
            !!regErrors.confirmPassword
          )} pr-10`}
        />

        <button
          type="button"
          onClick={() =>
            setShowRegConfirm(
              !showRegConfirm
            )
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          {showRegConfirm ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      {regErrors.confirmPassword && (
        <p className="text-xs text-red-500">
          {
            regErrors.confirmPassword
          }
        </p>
      )}
    </div>

    <button
      type="button"
      onClick={() => {
        if (validateStep1()) {
          setRegisterStep(2);
        }
      }}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium"
    >
      Continuar
    </button>
  </>
)}
{registerStep === 2 && (
  <>
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Nombre del taller
      </label>

      <input
        type="text"
        value={regForm.taller_nombre}
        onChange={(e) =>
          setRegForm({
            ...regForm,
            taller_nombre:
              e.target.value,
          })
        }
        className={inputCls(
          !!regErrors.taller_nombre
        )}
      />

      {regErrors.taller_nombre && (
        <p className="text-xs text-red-500">
          {
            regErrors.taller_nombre
          }
        </p>
      )}
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Dirección
      </label>

      <input
        type="text"
        value={
          regForm.taller_direccion
        }
        onChange={(e) =>
          setRegForm({
            ...regForm,
            taller_direccion:
              e.target.value,
          })
        }
        className={inputCls(
          !!regErrors.taller_direccion
        )}
      />

      {regErrors.taller_direccion && (
        <p className="text-xs text-red-500">
          {
            regErrors.taller_direccion
          }
        </p>
      )}
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        Teléfono del taller
      </label>

      <input
        type="text"
        value={
          regForm.taller_telefono
        }
        onChange={(e) =>
          setRegForm({
            ...regForm,
            taller_telefono:
              e.target.value,
          })
        }
        className={inputCls(
          !!regErrors.taller_telefono
        )}
      />

      {regErrors.taller_telefono && (
        <p className="text-xs text-red-500">
          {
            regErrors.taller_telefono
          }
        </p>
      )}
    </div>

    <div className="flex gap-3">
      <button
        type="button"
        onClick={() =>
          setRegisterStep(1)
        }
        className="flex-1 border border-slate-300 py-2.5 rounded-lg"
      >
        Volver
      </button>

      <button
        type="submit"
        disabled={regLoading}
        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
      >
        {regLoading ? (
          <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}

        {regLoading
          ? 'Creando cuenta...'
          : 'Crear Cuenta'}
      </button>
    </div>
  </>
)}
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 TallerPro · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-red-400 focus:ring-red-300"
      : "border-slate-200 focus:ring-blue-500"
  }`;
}

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 6) {
    score++;
  }

  if (password.length >= 10) {
    score++;
  }

  if (/[A-Z]/.test(password)) {
    score++;
  }

  if (/[0-9]/.test(password)) {
    score++;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  if (score <= 1) {
    return {
      score: 1,
      label: "Muy débil",
      color: "bg-red-500",
    };
  }

  if (score === 2) {
    return {
      score: 2,
      label: "Débil",
      color: "bg-orange-400",
    };
  }

  if (score === 3) {
    return {
      score: 3,
      label: "Regular",
      color: "bg-yellow-400",
    };
  }

  if (score === 4) {
    return {
      score: 4,
      label: "Fuerte",
      color: "bg-emerald-400",
    };
  }

  return {
    score: 5,
    label: "Muy fuerte",
    color: "bg-emerald-600",
  };
}

function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);

  return (
    <div className="space-y-1 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <p className={`text-xs ${color.replace("bg-", "text-")}`}>{label}</p>
    </div>
  );
}

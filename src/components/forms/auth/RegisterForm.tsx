import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterSchema } from "@/schemas/registerSchema";
import { inputClass } from "@/utils/inputClass";
import { AppError, handleError } from "@/lib/errors";
import { PasswordStrength } from "@/components/forms/auth/PasswordStrength";

const STEP_1_FIELDS = [
  "nombre",
  "apellido",
  "dni",
  "telefono",
  "email",
  "password",
  "confirmPassword",
] as const;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
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
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  async function handleNext() {
    const valid = await trigger(STEP_1_FIELDS);
    if (valid) setStep(2);
  }

  async function onSubmit(data: RegisterSchema) {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await registerUser({
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        telefono: data.telefono,
        email: data.email,
        password: data.password,
        taller_nombre: data.taller_nombre,
        taller_direccion: data.taller_direccion,
        taller_telefono: data.taller_telefono,
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
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
              step >= 1 ? "bg-blue-600" : "bg-slate-200"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 2 ? "bg-blue-600" : "bg-slate-200"
            }`}
          />
        </div>
        <p className="text-xs text-slate-500">Paso {step} de 2</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{error.message}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
          Cuenta creada correctamente.
        </div>
      )}

      {/* PASO 1 */}
      <div className={step === 1 ? "space-y-4" : "hidden"}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Nombre</label>
            <input
              type="text"
              {...register("nombre")}
              className={inputClass(!!errors.nombre)}
            />
            {errors.nombre && (
              <p className="text-xs text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Apellido
            </label>
            <input
              type="text"
              {...register("apellido")}
              className={inputClass(!!errors.apellido)}
            />
            {errors.apellido && (
              <p className="text-xs text-red-500">{errors.apellido.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">DNI</label>
            <input
              type="text"
              {...register("dni")}
              className={inputClass(!!errors.dni)}
            />
            {errors.dni && (
              <p className="text-xs text-red-500">{errors.dni.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              type="text"
              {...register("telefono")}
              className={inputClass(!!errors.telefono)}
            />
            {errors.telefono && (
              <p className="text-xs text-red-500">{errors.telefono.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`${inputClass(!!errors.password)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <PasswordStrength password={password} />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={`${inputClass(!!errors.confirmPassword)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showConfirm ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <p
              className={`text-xs ${
                passwordsMatch ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {passwordsMatch
                ? "Las contraseñas coinciden."
                : "Las contraseñas no coinciden."}
            </p>
          )}

          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium"
        >
          Continuar
        </button>
      </div>

      {/* PASO 2 */}
      <div className={step === 2 ? "space-y-4" : "hidden"}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Nombre del taller
          </label>
          <input
            type="text"
            {...register("taller_nombre")}
            className={inputClass(!!errors.taller_nombre)}
          />
          {errors.taller_nombre && (
            <p className="text-xs text-red-500">
              {errors.taller_nombre.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Dirección
          </label>
          <input
            type="text"
            {...register("taller_direccion")}
            className={inputClass(!!errors.taller_direccion)}
          />
          {errors.taller_direccion && (
            <p className="text-xs text-red-500">
              {errors.taller_direccion.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Teléfono del taller
          </label>
          <input
            type="text"
            {...register("taller_telefono")}
            className={inputClass(!!errors.taller_telefono)}
          />
          {errors.taller_telefono && (
            <p className="text-xs text-red-500">
              {errors.taller_telefono.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 border border-slate-300 py-2.5 rounded-lg"
          >
            Volver
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </div>
      </div>
    </form>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginSchema } from "@/schemas/loginSchema";
import { inputClass } from "@/utils/inputClass";
import { AppError, handleError } from "@/lib/errors";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    setError(null);
    setLoading(true);

    try {
      await login(data.email, data.password);

      navigate("/");
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
      <div className="flex items-center gap-2 text-blue-700">
        <ShieldCheck className="size-5" />

        <h2 className="font-semibold">
          Acceso al Sistema
        </h2>
      </div>

      <p className="text-slate-600 text-sm">
        Ingresá con tu cuenta para acceder al sistema.
      </p>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />

          <span>
            {error.message}
          </span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Email
        </label>

        <input
          type="email"
          placeholder="admin@tallerpro.com"
          {...register("email")}
          className={inputClass(!!errors.email)}
        />

        {errors.email && (
          <p className="text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Contraseña
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={`${inputClass(!!errors.password)} pr-10`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <LogIn className="size-4" />
        )}

        {loading ? "Ingresando..." : "Ingresar al Sistema"}
      </button>
    </form>
  );
}
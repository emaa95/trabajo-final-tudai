import { useEffect } from "react";

import {
  getCurrentSession,
  getCurrentUserData,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from "@/services/authService";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/authStore";

import type { RegisterPayload } from "@/types";

export function useAuth() {
  // =========================
  // STORE STATE
  // =========================

  const authUser = useAuthStore((state) => state.authUser);
  const currentUser = useAuthStore((state) => state.currentUser);
  const loading = useAuthStore((state) => state.loading);

  // =========================
  // STORE ACTIONS
  // =========================

  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  // =========================
  // INIT AUTH + LISTENER (FIX CLAVE)
  // =========================

  useEffect(() => {
    async function initializeAuth() {
      try {
        const session = await getCurrentSession();

        setAuthUser(session?.user ?? null);

        if (session?.user) {
          const currentUser = await getCurrentUserData();
          setCurrentUser(currentUser);
        } else {
          setCurrentUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // 🔥 LISTENER REAL DE SUPABASE
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthUser(session?.user ?? null);

        if (!session?.user) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const currentUser = await getCurrentUserData();
        setCurrentUser(currentUser);

        setLoading(false);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // =========================
  // LOGIN
  // =========================

  async function login(email: string, password: string) {
    try {
      setLoading(true);

      const response = await loginService(email, password);

      setAuthUser(response.user ?? null);

      if (response.user) {
        const currentUser = await getCurrentUserData();
        setCurrentUser(currentUser);
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al iniciar sesión",
      };
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // REGISTER
  // =========================

  async function register(payload: RegisterPayload) {
    try {
      setLoading(true);

      await registerService(payload);

      const session = await getCurrentSession();

      setAuthUser(session?.user ?? null);

      if (session?.user) {
        const currentUser = await getCurrentUserData();
        setCurrentUser(currentUser);
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al registrar usuario",
      };
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOGOUT (SIMPLIFICADO)
  // =========================

  async function logout() {
    try {
      setLoading(true);

      await logoutService();

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al cerrar sesión",
      };
    } finally {
      setLoading(false);
    }
  }

  return {
    authUser,
    currentUser,
    loading,
    login,
    register,
    logout,
  };
}
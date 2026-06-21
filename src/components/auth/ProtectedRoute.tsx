import { Navigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {

  const {
    authUser,
    loading,
  } = useAuth();

  // Esperando auth inicial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="size-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No autenticado
  if (!authUser) {
    return (
      <Navigate
        to="/auth"
        replace
      />
    );
  }

  return children;
}
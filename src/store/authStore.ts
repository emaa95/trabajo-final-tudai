// src/store/authStore.ts
import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { CurrentUser } from '@/types';

interface AuthStore {
  authUser: User | null;
  currentUser: CurrentUser | null;
  loading: boolean;
  setAuthUser: (user: User | null) => void;
  setCurrentUser: (user: CurrentUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  authUser: null,
  currentUser: null,
  loading: true,
  setAuthUser: (authUser) => set({ authUser }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setLoading: (loading) => set({ loading }),
}));
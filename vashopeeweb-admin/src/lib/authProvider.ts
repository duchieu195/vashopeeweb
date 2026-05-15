import type { AuthProvider } from '@refinedev/core';
import { supabaseAuthClient as supabaseClient } from './supabase';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error };
    return { success: true, redirectTo: '/dashboard' };
  },

  logout: async () => {
    await supabaseClient.auth.signOut();
    return { success: true, redirectTo: '/login' };
  },

  check: async () => {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) return { authenticated: true };
    return { authenticated: false, redirectTo: '/login' };
  },

  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();
    if (data.user) return { id: data.user.id, name: data.user.email, avatar: '' };
    return null;
  },

  onError: async (error) => {
    if (error?.status === 401) return { logout: true };
    return { error };
  },
};

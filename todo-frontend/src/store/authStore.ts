import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  email: string | null;
  setAuthInfo: (token: string, username: string, email: string) => void;
  clearAuthInfo: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  email: null,
  setAuthInfo: (token, username, email) =>
    set({ token, username, email }),
  clearAuthInfo: () =>
    set({ token: null, username: null, email: null }),
}));

export default useAuthStore;


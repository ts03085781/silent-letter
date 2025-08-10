import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  anonymousId: string;
  points: number;
  createdAt: string;
  lastActiveAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updatePoints: (newPoints: number) => void;
  register: () => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthStore extends AuthState, AuthActions {}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      updatePoints: (newPoints: number) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, points: newPoints },
          });
        }
      },

      register: async () => {
        const { setLoading, setError, setUser } = get();
        
        try {
          setLoading(true);
          setError(null);

          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
          }

          setUser(data.user);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          setError(errorMessage);
          console.error('Registration error:', error);
        } finally {
          setLoading(false);
        }
      },

      fetchUser: async () => {
        const { setLoading, setError, setUser, clearUser } = get();
        
        try {
          setLoading(true);
          setError(null);

          const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 401) {
              // Token 無效或過期
              clearUser();
              return;
            }
            throw new Error(data.error || 'Failed to fetch user');
          }

          setUser(data.user);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
          setError(errorMessage);
          console.error('Fetch user error:', error);
        } finally {
          setLoading(false);
        }
      },

      logout: async () => {
        const { setLoading, clearUser } = get();
        
        try {
          setLoading(true);

          // 清除客戶端 cookie
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          
          clearUser();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
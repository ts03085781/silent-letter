import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppPage = 'welcome' | 'main';

interface AppState {
  currentPage: AppPage;
  hasSeenWelcome: boolean;
}

interface AppActions {
  setCurrentPage: (page: AppPage) => void;
  markWelcomeSeen: () => void;
  resetWelcomeStatus: () => void;
}

export interface AppStore extends AppState, AppActions {}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      currentPage: 'welcome',
      hasSeenWelcome: false,

      // Actions
      setCurrentPage: (page: AppPage) => {
        set({ currentPage: page });
      },

      markWelcomeSeen: () => {
        set({ 
          hasSeenWelcome: true,
          currentPage: 'main'
        });
      },

      resetWelcomeStatus: () => {
        set({ 
          hasSeenWelcome: false,
          currentPage: 'welcome'
        });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        hasSeenWelcome: state.hasSeenWelcome,
        currentPage: state.currentPage,
      }),
    }
  )
);

export default useAppStore;
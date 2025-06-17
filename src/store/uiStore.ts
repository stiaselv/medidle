import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isFooterExpanded: boolean;
  toggleFooter: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isFooterExpanded: false,
      toggleFooter: () => set((state) => ({ isFooterExpanded: !state.isFooterExpanded })),
    }),
    {
      name: 'ui-storage',
    }
  )
); 
import { create } from 'zustand';

export const useStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  notificationsEnabled: false,
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));

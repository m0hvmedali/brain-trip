import { create } from 'zustand'

export const useStore = create((set) => ({
  darkMode: false,
  notificationsEnabled: false,
  privacyMode: false,
  
  setDarkMode: (darkMode) => {
    set({ darkMode })
    localStorage.setItem('darkMode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  
  setNotificationsEnabled: (enabled) => {
    set({ notificationsEnabled: enabled })
    localStorage.setItem('notificationsEnabled', enabled.toString())
  },
  
  setPrivacyMode: (privacyMode) => set({ privacyMode }),
}))
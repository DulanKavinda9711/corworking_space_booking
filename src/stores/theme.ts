import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State - Pinia persistence will handle sessionStorage automatically
  const theme = ref<string>('light')

  // Actions
  const setTheme = (newTheme: string) => {
    theme.value = newTheme

    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Initialize theme on store creation
  setTheme(theme.value)

  return {
    theme,
    setTheme,
    toggleTheme
  }
}, {
  persist: true
})
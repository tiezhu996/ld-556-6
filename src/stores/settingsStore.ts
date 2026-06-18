import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ThemeMode } from '@/types/settings'
import { clearEncryptionKey, hasEncryptionKey, setupEncryptionPassword } from '@/utils/crypto'

export const useSettingsStore = defineStore('settings', () => {
  const encryptionReady = ref(hasEncryptionKey())
  const encryptionHint = ref(localStorage.getItem('legacytree.encryptionHint') || '未设置')
  const theme = ref<ThemeMode>((localStorage.getItem('legacytree.theme') as ThemeMode) || 'light')

  async function setPassword(password: string, hint = '已设置') {
    await setupEncryptionPassword(password)
    encryptionReady.value = true
    encryptionHint.value = hint
    localStorage.setItem('legacytree.encryptionHint', hint)
  }

  function lockEncryption() {
    clearEncryptionKey()
    encryptionReady.value = false
  }

  function setTheme(next: ThemeMode) {
    theme.value = next
    localStorage.setItem('legacytree.theme', next)
    document.documentElement.dataset.theme = next
  }

  return { encryptionReady, encryptionHint, theme, setPassword, lockEncryption, setTheme }
})

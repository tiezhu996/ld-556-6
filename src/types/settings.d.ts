export type ThemeMode = 'light' | 'dark'

export interface SettingsState {
  encryptionReady: boolean
  encryptionHint: string
  theme: ThemeMode
}

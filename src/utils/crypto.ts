const KEY_SESSION_NAME = 'legacytree.crypto.key'
const SALT_SESSION_NAME = 'legacytree.crypto.salt'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

export interface EncryptedPayload {
  __encrypted: true
  iv: string
  salt: string
  data: string
}

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const raw = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  return btoa(String.fromCharCode(...raw))
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
}

async function importPasswordKey(password: string) {
  return crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey'])
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await importPasswordKey(password)
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 120_000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function setupEncryptionPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await deriveKey(password, salt)
  const raw = await crypto.subtle.exportKey('raw', key)
  sessionStorage.setItem(KEY_SESSION_NAME, toBase64(raw))
  sessionStorage.setItem(SALT_SESSION_NAME, toBase64(salt))
}

export async function unlockEncryption(password: string, saltBase64?: string) {
  const salt = saltBase64 ? fromBase64(saltBase64) : fromBase64(sessionStorage.getItem(SALT_SESSION_NAME) || toBase64(crypto.getRandomValues(new Uint8Array(16))))
  const key = await deriveKey(password, salt)
  const raw = await crypto.subtle.exportKey('raw', key)
  sessionStorage.setItem(KEY_SESSION_NAME, toBase64(raw))
  sessionStorage.setItem(SALT_SESSION_NAME, toBase64(salt))
}

export function clearEncryptionKey() {
  sessionStorage.removeItem(KEY_SESSION_NAME)
}

export function getStoredSalt(): string {
  return sessionStorage.getItem(SALT_SESSION_NAME) || ''
}

export function hasEncryptionKey(): boolean {
  return Boolean(sessionStorage.getItem(KEY_SESSION_NAME))
}

async function getSessionKey(): Promise<CryptoKey> {
  const rawKey = sessionStorage.getItem(KEY_SESSION_NAME)
  if (!rawKey) throw new Error('加密密钥未解锁，请先在设置中输入密码')
  return crypto.subtle.importKey('raw', fromBase64(rawKey), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export async function encryptText(value: string): Promise<EncryptedPayload> {
  const key = await getSessionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(value))
  return {
    __encrypted: true,
    iv: toBase64(iv),
    salt: getStoredSalt(),
    data: toBase64(encrypted)
  }
}

export async function decryptText(payload: EncryptedPayload): Promise<string> {
  const key = await getSessionKey()
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(payload.iv) }, key, fromBase64(payload.data))
  return decoder.decode(decrypted)
}

export function isEncryptedPayload(value: unknown): value is EncryptedPayload {
  return Boolean(value && typeof value === 'object' && '__encrypted' in value)
}

export async function encryptJson<T>(value: T): Promise<EncryptedPayload> {
  return encryptText(JSON.stringify(value))
}

export async function decryptJson<T>(value: T | EncryptedPayload): Promise<T> {
  if (!isEncryptedPayload(value)) return value
  return JSON.parse(await decryptText(value)) as T
}

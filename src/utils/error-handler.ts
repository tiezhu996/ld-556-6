import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

let messageApi: MessageApiInjection | null = null

export function registerMessageApi(api: MessageApiInjection) {
  messageApi = api
}

export function notifyError(error: unknown, fallback = '操作失败，请稍后重试') {
  const message = error instanceof Error ? error.message : fallback
  if (messageApi) {
    messageApi.error(message.includes('decrypt') || message.includes('解密') ? '解密失败，请检查密码是否正确' : message)
    return
  }
  console.error(error)
}

export async function withFriendlyError<T>(task: () => Promise<T>, fallback?: string): Promise<T | undefined> {
  try {
    return await task()
  } catch (error) {
    notifyError(error, fallback)
    return undefined
  }
}

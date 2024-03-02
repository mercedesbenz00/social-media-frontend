import { ref } from 'vue'
import type { IRequest } from '@/data/main.interface'
import type { Ref } from 'vue-demi'

interface ReqType<T = any, P = any> {
  req: ((payload: P) => string | IRequest) | string | IRequest
  signal?: AbortSignal | undefined
  cacheValue?: any
  shouldCancel?: () => boolean
  onStart?: () => void
  onSuccess?: (item: T) => void
  onError?: (error: Error | any) => void
  onComplete?: () => void
}

type Handler<T = any, P = any> = {
  handleStart?: () => void
  shouldForce?: boolean | (() => boolean)
  handleSuccess?: (item: T) => void
  handleError?: (error: Error) => void
  handleComplete?: () => void
  payload?: P
}

export function useRequest<T = any, P = any>({
  signal,
  onSuccess,
  onError,
  onComplete,
  req,
  onStart,
  shouldCancel,
  cacheValue,
}: ReqType<T, P>) {
  const loading = ref(false)
  const data = ref<T>()
  const error = ref<Error | null>(null)

  const callApiReq = async ({
    handleStart,
    handleSuccess,
    handleError,
    handleComplete,
    payload,
    shouldForce = false,
  }: Handler<T, P> = {}): Promise<T | undefined> => {
    if ((typeof shouldCancel === 'function' && shouldCancel()) || shouldForce) return cacheValue

    loading.value = true
    let r

    if (typeof req === 'function') {
      r = req(payload as any)
    } else {
      r = req
    }

    if (onStart) onStart()
    if (handleStart) handleStart()

    try {
      const res = await useApi<T>(r, { signal })

      data.value = res.data
      if (onSuccess) {
        onSuccess(res.data)
      }
      if (handleSuccess) {
        handleSuccess(res.data)
      }
      return res.data
    } catch (e) {
      error.value = e
      if (onError) {
        onError(e)
      }
      if (handleError) {
        handleError(e)
      }
    } finally {
      loading.value = false
      if (onComplete) {
        onComplete()
      }
      if (handleComplete) {
        handleComplete()
      }
    }
  }

  return [callApiReq, data, loading, error] as [
    (handlers?: Handler<T, P>) => Promise<T>,
    Ref<T | null>,
    Ref<boolean>,
    Ref<Error>
  ]
}

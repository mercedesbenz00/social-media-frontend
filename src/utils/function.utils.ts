export function tryCall<T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>): any {
  if (typeof fn === 'function') {
    return fn(...args)
  }
}

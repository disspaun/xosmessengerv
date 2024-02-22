import { sleep } from '@src/utils/sleep'

export async function repeatAsync(fn: () => Promise<void>, times: number, timeout = 0): Promise<void> {
  if (times === 0) {
    return
  }
  await fn()
  timeout && (await sleep(timeout))
  await repeatAsync(fn, --times, timeout)
}

export function repeat(fn: () => void, times: number, timeout = 0): void {
  if (times === 0) {
    return
  }
  fn()
  const re = repeat.bind(null, fn, --times, timeout)
  timeout ? setTimeout(re, timeout) : re()
}

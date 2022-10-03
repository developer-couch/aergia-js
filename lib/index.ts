export interface LazyArray<T> {
  toArray: () => T[]

  get length(): number
}

export function arange(stop: number): LazyArray<number>
export function arange(start: number, stop: number): LazyArray<number>
export function arange(start: number, stop: number, step: number): LazyArray<number>
export function arange(_start: number, _stop?: number, step: number = 1): LazyArray<number> {
  const start = _stop !== undefined ? _start : 0
  const stop = _stop !== undefined ? _stop : _start

  const length = Math.max(0, Math.ceil((stop - start) / step))

  return {
    toArray: () => new Array(length).fill(0).map((_, i) => start + step * i),

    get length() {
      return this.toArray().length
    }
  }
}

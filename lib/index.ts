export function arange(stop: number): Iterable<number>
export function arange(start: number, stop: number): Iterable<number>
export function arange(start: number, stop: number, step: number): Iterable<number>
export function arange(_start: number, _stop?: number, step: number = 1): Iterable<number> {
  if (step === 0) {
    throw new RangeError('Invalid arange step')
  }

  const start = _stop !== undefined ? _start : 0
  const stop = _stop !== undefined ? _stop : _start

  const length = Math.max(0, Math.ceil((stop - start) / step))

  return {
    [Symbol.iterator]: function * () {
      let x = start
      let i = 0
      while (i < length) {
        yield x
        x += step
        i += 1
      }
    }
  }
}

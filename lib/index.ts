export function shift<T>(iterator: Iterator<T>, n: number = 0): IteratorResult<T> {
  const result = iterator.next()
  if (n < 1) {
    return result
  }
  return shift(iterator, n - 1)
}

export function reduce<T, U>(iterator: Iterator<T>, reducer: (value: T, result: U) => U, initialValue: U, n: number = Infinity, stop?: (value: T) => boolean): U {
  const { value, done } = shift(iterator)
  if (done === true) {
    return initialValue
  }
  if (n < 2 || stop?.(value) === true) {
    return reducer(value, initialValue)
  }
  return reduce(iterator, reducer, reducer(value, initialValue), n - 1)
}

export function every<T>(iterator: Iterator<T>, test: (value: T) => boolean, n: number = Infinity): boolean {
  return reduce(iterator, (value, result) => test(value) && result, true, n, (value) => !test(value))
}

export function some<T>(iterator: Iterator<T>, test: (value: T) => boolean, n: number = Infinity): boolean {
  return !every(iterator, (value) => !test(value), n)
}

export function take<T>(iterator: Iterator<T>, n: number = Infinity): T[] {
  return reduce(iterator, (value, result) => { result.push(value); return result }, [] as T[], n)
}

export function count<T>(iterator: Iterator<T>, test: (value: T) => boolean, n: number = Infinity): number {
  return reduce(iterator, (value, result) => result + (test(value) ? 1 : 0), 0, n)
}

export function min<T>(iterator: Iterator<T>, lessThan: (value: T, otherValue: T) => boolean, n: number = Infinity): T {
  const { value: first, done } = shift(iterator)
  if (done === true) {
    throw TypeError('Empty iterator')
  }
  return reduce(iterator, (value, otherValue) => lessThan(value, otherValue) ? value : otherValue, first, n)
}

export function max<T>(iterator: Iterator<T>, lessThan: (value: T, otherValue: T) => boolean, n: number = Infinity): T {
  return min(iterator, (value, otherValue) => lessThan(otherValue, value), n)
}

export function sort<T>(iterator: Iterator<T>, lessThan: (value: T, otherValue: T) => boolean, n: number = Infinity): T[] {
  // TODO: make it faster by taking while sorting with a BST.
  // Every operation should use reduce for performance optimization
  return take(iterator, n).sort((value, otherValue) => lessThan(value, otherValue) ? -1 : 1)
}

export function map<T, U>(iterator: Iterator<T>, mapper: (value: T) => U): Iterator<U> {
  return {
    next(): IteratorResult<U> {
      const { value, done } = shift(iterator)
      if (done === true) {
        return { value, done }
      }
      return { value: mapper(value), done }
    }
  }
}

export function filter<T, U extends T>(iterator: Iterator<T>, test: (value: T) => value is U): Iterator<U>
export function filter<T>(iterator: Iterator<T>, test: (value: T) => boolean): Iterator<T>
export function filter<T>(iterator: Iterator<T>, test: (value: T) => boolean): Iterator<T> {
  return {
    next(): IteratorResult<T> {
      const { value, done } = shift(iterator)
      if (done === true || test(value)) {
        return { value, done }
      }
      return this.next()
    }
  }
}

export function arange(stop: number): Iterator<number>
export function arange(start: number, stop: number): Iterator<number>
export function arange(start: number, stop: number, step: number): Iterator<number>
export function arange(_start: number, _stop?: number, step: number = 1): Iterator<number> {
  const start = _stop === undefined ? 0 : _start
  const stop = _stop === undefined ? _start : _stop

  return sequence((n: number) => start + n * step, (stop - start) / step)
}

export function sequence<T>(nth: (n: number) => T, length: number = Infinity): Iterator<T> {
  let i = 0

  return {
    next(): IteratorResult<T> {
      if (!(i < length)) {
        return { done: true, value: undefined }
      }
      return { value: nth(i++) }
    }
  }
}

// export function iterator<T>(nth: (n0: T, ...previous: T[]) => T, ...initial): Iterator<T>

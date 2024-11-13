/**
 * Shifts an iterator n + 1 times and returns the nth value.
 * @param iterator An iterator whose first n elements will be removed.
 * @param n The number of elements to remove starting from 0.
 * @returns The nth element removed.
 */
export function shift<T>(iterator: Iterator<T>, n: number = 0): IteratorResult<T> {
  const result = iterator.next()
  if (n < 1) {
    return result
  }
  return shift(iterator, n - 1)
}

/**
 * Reduces an iterator, applying a function to each element to return a result.
 * @param iterator An iterator which will be reduced.
 * @param reducer The function which will be applied to each element along with the result so far.
 * @param n The number of elements to take from the iterator.
 * @param stop A function that will be called for every element. The reduce will stop early if this function returns true.
 * @returns The result of calling reducer on every element until n, the end of the array, or until stop returns true.
 */
export function reduce<T, U>(iterator: Iterator<T>, reducer: (value: T, result: U) => U, initialValue: U, n: number = Infinity, stop?: (value: T) => boolean): U {
  if (n < 1) {
    return initialValue
  }
  const { value, done } = shift(iterator)
  if (done === true) {
    return initialValue
  }
  if (stop?.(value) === true) {
    return reducer(value, initialValue)
  }
  return reduce(iterator, reducer, reducer(value, initialValue), n - 1, stop)
}

/**
 * Evaluates every element, returning true if every element is evaluated to true.
 * @param iterator An iterator which will be evaluated for every element.
 * @param reducer The function which will be applied to each element along.
 * @param n The number of elements to evaluate.
 * @returns True if every element evaluates to true.
 */
export function every<T>(iterator: Iterator<T>, test: (value: T) => boolean, n: number = Infinity): boolean {
  return reduce(iterator, (value, result) => test(value) && result, true, n, (value) => !test(value))
}

/**
 * Evaluates every element, returning true if some elements are evaluated to true.
 * @param iterator An iterator which will be evaluated for every element.
 * @param reducer The function which will be applied to each element along.
 * @param n The number of elements to evaluate.
 * @returns True if every element evaluates to true.
 */
export function some<T>(iterator: Iterator<T>, test: (value: T) => boolean, n: number = Infinity): boolean {
  return !every(iterator, (value) => !test(value), n)
}

/**
 * Takes n elements or up to the end of the iterator and returns an array with them.
 * @param iterator An iterator from which the elements will be taken.
 * @param n The number of elements to take.
 * @returns An array with the taken elements.
 */
export function take<T>(iterator: Iterator<T>, n: number = Infinity): T[] {
  return reduce(iterator, (value, result) => { result.push(value); return result }, [] as T[], n)
}

/**
 * Counts the number of elements that satisfies a test.
 * @param iterator An iterator whose elements will be counted.
 * @param test A function which will be evaluated on every element.
 * @param n The number of elements to count.
 * @returns The number of elements that satisfy the test.
 */
export function count<T>(iterator: Iterator<T>, test: (value: T) => boolean, n: number = Infinity): number {
  return reduce(iterator, (value, result) => result + (test(value) ? 1 : 0), 0, n)
}

/**
 * Evaluates n elements or up to the end of the iterator and returns the minimum value according to a comparison function.
 * @param iterator An iterator whose elements will be evaluated.
 * @param lessThan A comparison function which takes two elements and returns true if the first one is less than the second one.
 * @param n The number of elements to evaluate.
 * @returns The minimum value found.
 */
export function min<T>(iterator: Iterator<T>, lessThan: (value: T, otherValue: T) => boolean, n: number = Infinity): T {
  const { value: first, done } = shift(iterator)
  if (done === true) {
    throw TypeError('Empty iterator')
  }
  return reduce(iterator, (value, otherValue) => lessThan(value, otherValue) ? value : otherValue, first, n)
}

/**
 * Evaluates n elements or up to the end of the iterator and returns the maximum value according to a comparison function.
 * @param iterator An iterator whose elements will be evaluated.
 * @param lessThan A comparison function which takes two elements and returns true if the first one is less than the second one.
 * @param n The number of elements to evaluate.
 * @returns The maximum value found.
 */
export function max<T>(iterator: Iterator<T>, lessThan: (value: T, otherValue: T) => boolean, n: number = Infinity): T {
  return min(iterator, (value, otherValue) => lessThan(otherValue, value), n)
}

/**
 * Evaluates n elements or up to the end of the iterator and returns an array of the sorted elements according to a comparison function.
 * @param iterator An iterator whose elements will be evaluated.
 * @param lessThan A comparison function which takes two elements and returns true if the first one is less than the second one.
 * @param n The number of elements to evaluate.
 * @returns A sorted array of the elements.
 */
export function sort<T>(iterator: Iterator<T>, lessThan: (value: T, otherValue: T) => boolean, n: number = Infinity): T[] {
  // TODO: make it faster by taking while sorting with a BST.
  // Every operation should use reduce for performance optimization.
  return take(iterator, n).sort((value, otherValue) => lessThan(value, otherValue) ? -1 : 1)
}

/**
 * Return a new iterator, linked to the first one, which will apply a mapping function to every element.
 * @param iterator An iterator whose elements will be evaluated.
 * @param mapper A mapper value which will be called for every element.
 * @returns A new iterator with the first iterator elements mapped.
 */
export function map<T, U>(iterator: Iterator<T>, mapper: (value: T) => U): Iterator<U> {
  return {
    next() {
      const { value, done } = shift(iterator)
      if (done === true) {
        return { value, done }
      }
      return { value: mapper(value), done }
    }
  }
}

/**
 * Return a new iterator, linked to the first one, which will only contain the elements that satisfies a test.
 * @param iterator An iterator whose elements will be evaluated.
 * @param mapper A function which will be called for every element.
 * @returns A new iterator with a subset of the elements from the first one.
 */
export function filter<T, U extends T>(iterator: Iterator<T>, test: (value: T) => value is U): Iterator<U>
export function filter<T>(iterator: Iterator<T>, test: (value: T) => boolean): Iterator<T>
export function filter<T>(iterator: Iterator<T>, test: (value: T) => boolean): Iterator<T> {
  return {
    next() {
      const { value, done } = shift(iterator)
      if (done === true || test(value)) {
        return { value, done }
      }
      return this.next()
    }
  }
}

/**
 * Creates a new iterator based on a function which generates the items based on the index number of the element.
 * @param nth A function which receives the index of the elements and returns the nth element of the created iterator.
 * @param length The length of the returned iterator.
 * @returns The created iterator.
 */
export function sequence<T>(nth: (n: number) => T, length: number = Infinity): Iterator<T> {
  let i = 0

  return {
    next() {
      if (!(i < length)) {
        return { done: true, value: undefined }
      }
      return { value: nth(i++), done: false }
    }
  }
}

/**
 * Creates a new iterator of consecutive numbers staring from 0 up to stop.
 * @param stop The number up to which elements will be created. Not included on the returned iterator.
 * @returns The created iterator.
 */
export function arrange(stop: number): Iterator<number>

/**
 * Creates a new iterator of consecutive numbers staring from start up to stop.
 * @param start The first number of the iterator.
 * @param stop The number up to which elements will be created. Not included on the returned iterator.
 * @returns The created iterator.
 */
export function arrange(start: number, stop: number): Iterator<number>

/**
 * Creates a new iterator of numbers separated by step staring from start up to stop.
 * @param start The first number of the iterator.
 * @param stop The number up to which elements will be created. Not included on the returned iterator.
 * @param step The difference between two elements of the created iterator.
 * @returns The created iterator.
 */
export function arrange(start: number, stop: number, step: number): Iterator<number>

export function arrange(_start: number, _stop?: number, step: number = 1): Iterator<number> {
  const start = _stop === undefined ? 0 : _start
  const stop = _stop === undefined ? _start : _stop

  return sequence((n: number) => start + n * step, (stop - start) / step)
}

/**
 * Creates a new iterator based on a function which generates the items based on the previous elements.
 * @param nth A function which receives the previous elements and returns the next element of the created iterator.
 * @param length The length of the created iterator. Defaults to infinity.
 * @param initial The first elements of the created iterator, from which to base all the next elements.
 * @returns The created iterator.
 */
export function recursive<T, P extends [T, ...T[]]>(nth: (...previous: P) => T, length: number = Infinity, ...initial: P): Iterator<T> {
  return sequence(
    function (): T {
      initial.push(nth(...initial))
      return initial.shift() as T
    },
    length
  )
}

/**
 * Creates an empty iterator.
 * @returns The created empty iterator.
 */
export function empty<T>(): Iterator<T> {
  return {
    next() {
      return { done: true, value: undefined }
    }
  }
}

/**
 * Creates a new iterator linked to the passed iterators, which will contain the elements of the passed iterators.
 * @param iterators The iterators which will be concatenated.
 * @returns The created iterator.
 */
export function concatenate<T>(...iterators: [Iterator<T>, ...Array<Iterator<T>>]): Iterator<T> {
  const iteratorsIterator = iterators[Symbol.iterator]()
  let { value: nextIterator, done: iteratorsDone } = shift(iteratorsIterator)

  return {
    next() {
      if (iteratorsDone === true) {
        return { done: true, value: undefined }
      }
      const { done, value } = nextIterator.next()
      if (done === true) {
        ({ value: nextIterator, done: iteratorsDone } = shift(iteratorsIterator))
        return this.next()
      }
      return { value, done: false }
    }
  }
}

/**
 * Creates a new iterator, linked to the passed iterator, that will be un-shifted with the passed values.
 * @param iterator The iterator which will be un-shifted.
 * @param values The values to unshift.
 * @returns The created iterator which will contain the passed values and the iterator.
 */
export function unshift<T>(iterator: Iterator<T>, ...values: [T, ...T[]]): Iterator<T> {
  return concatenate(values[Symbol.iterator](), iterator)
}

/**
 * Creates a new iterator from an iterable object.
 * @param iterable An iterable object.
 * @returns The created iterator which will contain the values from iterable object in the same order.
 */
export function iterator<T>(iterable: Iterable<T>): Iterator<T>

/**
 * Creates a new iterator from an indexable object.
 * @param arrayLike An array like object.
 * @returns The created iterator which will contain the values from the array like object in the same order.
 */
export function iterator<T>(arrayLike: ArrayLike<T>): Iterator<T>

/**
 * Creates a new iterator from an Array.
 * @param array An array.
 * @returns The created iterator which will contain the values from the array in the same order.
 */
export function iterator<T>(array: T[]): Iterator<T>

export function iterator<T>(array: ArrayLike<T> | Iterable<T>): Iterator<T> {
  if (Symbol.iterator in array) {
    return array[Symbol.iterator]()
  }

  return sequence((n) => array[n], array.length)
}

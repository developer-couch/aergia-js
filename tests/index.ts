import assert from 'node:assert'
import { describe, it } from 'node:test'

import { arrange, concatenate, empty, iterator, recursive, sequence, take, unshift } from '../lib/'

describe('iterator', function () {
  it('returns an empty iterator when passed an empty list', function () {
    const iter = iterator([])
    const { done } = iter.next()
    assert.strictEqual(done, true)
  })

  it('returns an iterator with the elements of the list', function () {
    const iter = iterator([1, 2, 3])
    const { value: value1, done: done1 } = iter.next()
    assert.strictEqual(value1, 1)
    assert.strictEqual(done1, false)
    const { value: value2, done: done2 } = iter.next()
    assert.strictEqual(value2, 2)
    assert.strictEqual(done2, false)
    const { value: value3, done: done3 } = iter.next()
    assert.strictEqual(value3, 3)
    assert.strictEqual(done3, false)
    const { value: value4, done: done4 } = iter.next()
    assert.strictEqual(value4, undefined)
    assert.strictEqual(done4, true)
  })
})

describe('unshift', function () {
  it('returns a new iterator with the un-shifted element first', function () {
    const iter = iterator([2, 3])
    const shifted = unshift(iter, 1)
    const { value: value1, done: done1 } = shifted.next()
    assert.strictEqual(value1, 1)
    assert.strictEqual(done1, false)
    const { value: value2, done: done2 } = shifted.next()
    assert.strictEqual(value2, 2)
    assert.strictEqual(done2, false)
    const { value: value3, done: done3 } = shifted.next()
    assert.strictEqual(value3, 3)
    assert.strictEqual(done3, false)
    const { value: value4, done: done4 } = shifted.next()
    assert.strictEqual(value4, undefined)
    assert.strictEqual(done4, true)
  })

  it('multiple elements are un-shifted from left to right', function () {
    const iter = iterator([3])
    const shifted = unshift(iter, 1, 2)
    const { value: value1, done: done1 } = shifted.next()
    assert.strictEqual(value1, 1)
    assert.strictEqual(done1, false)
    const { value: value2, done: done2 } = shifted.next()
    assert.strictEqual(value2, 2)
    assert.strictEqual(done2, false)
    const { value: value3, done: done3 } = shifted.next()
    assert.strictEqual(value3, 3)
    assert.strictEqual(done3, false)
    const { value: value4, done: done4 } = shifted.next()
    assert.strictEqual(value4, undefined)
    assert.strictEqual(done4, true)
  })
})

describe('empty', function () {
  it('returns an empty iterator', function () {
    const iter = empty()
    const { value, done } = iter.next()
    assert.strictEqual(value, undefined)
    assert.strictEqual(done, true)
  })
})

describe('recursive', function () {
  it('returns an empty iterator if length is zero', function () {
    const iter = recursive((p) => p, 0, 0)
    const { value, done } = iter.next()
    assert.strictEqual(value, undefined)
    assert.strictEqual(done, true)
  })

  it('returns an iterator of passed length with the specified recursive relation', function () {
    const iter = recursive((p) => p + 1, 3, 1)
    const { value: value1, done: done1 } = iter.next()
    assert.strictEqual(value1, 1)
    assert.strictEqual(done1, false)
    const { value: value2, done: done2 } = iter.next()
    assert.strictEqual(value2, 2)
    assert.strictEqual(done2, false)
    const { value: value3, done: done3 } = iter.next()
    assert.strictEqual(value3, 3)
    assert.strictEqual(done3, false)
    const { value: value4, done: done4 } = iter.next()
    assert.strictEqual(value4, undefined)
    assert.strictEqual(done4, true)
  })

  it('can take more than one previous elements', function () {
    const iter = recursive((p0, p1) => p0 + p1, 7, 0, 1)
    const { value: value1, done: done1 } = iter.next()
    assert.strictEqual(value1, 0)
    assert.strictEqual(done1, false)
    const { value: value2, done: done2 } = iter.next()
    assert.strictEqual(value2, 1)
    assert.strictEqual(done2, false)
    const { value: value3, done: done3 } = iter.next()
    assert.strictEqual(value3, 1)
    assert.strictEqual(done3, false)
    const { value: value4, done: done4 } = iter.next()
    assert.strictEqual(value4, 2)
    assert.strictEqual(done4, false)
    const { value: value5, done: done5 } = iter.next()
    assert.strictEqual(value5, 3)
    assert.strictEqual(done5, false)
    const { value: value6, done: done6 } = iter.next()
    assert.strictEqual(value6, 5)
    assert.strictEqual(done6, false)
    const { value: value7, done: done7 } = iter.next()
    assert.strictEqual(value7, 8)
    assert.strictEqual(done7, false)
    const { value: value8, done: done8 } = iter.next()
    assert.strictEqual(value8, undefined)
    assert.strictEqual(done8, true)
  })
})

describe('concatenate', function () {
  it('ignores empty iterators', function () {
    const iter = concatenate(iterator([]), iterator([]))
    const { value, done } = iter.next()
    assert.strictEqual(value, undefined)
    assert.strictEqual(done, true)
  })

  it('concatenates iterators from left to right', function () {
    const iter = concatenate(iterator([1, 2]), iterator([3]))
    const { value: value1, done: done1 } = iter.next()
    assert.strictEqual(value1, 1)
    assert.strictEqual(done1, false)
    const { value: value2, done: done2 } = iter.next()
    assert.strictEqual(value2, 2)
    assert.strictEqual(done2, false)
    const { value: value3, done: done3 } = iter.next()
    assert.strictEqual(value3, 3)
    assert.strictEqual(done3, false)
    const { value: value4, done: done4 } = iter.next()
    assert.strictEqual(value4, undefined)
    assert.strictEqual(done4, true)
  })
})

describe('take', function () {
  it('returns an empty array if the iterator was empty', function () {
    assert.deepStrictEqual(take(empty()), [])
  })

  it('returns an empty array if length is zero', function () {
    const iter = recursive((p0, p1) => p0 + p1, Infinity, 0, 1)
    assert.deepStrictEqual(take(iter, 0), [])
  })

  it('returns an array of the specified length with the elements from the iterator', function () {
    const iter = recursive((p0, p1) => p0 + p1, Infinity, 0, 1)
    assert.deepStrictEqual(take(iter, 8), [0, 1, 1, 2, 3, 5, 8, 13])
  })

  it('returns an array of the length of the iterator if it it less than the passed length', function () {
    const iter = recursive((p0, p1) => p0 + p1, 4, 0, 1)
    assert.deepStrictEqual(take(iter, 8), [0, 1, 1, 2])
  })
})

describe('sequence', function () {
  it('returns an empty iterator when length is 0', function () {
    const iter = sequence((n) => n, 0)
    assert.deepStrictEqual(take(iter), [])
  })

  it('returns an iterator of the specified length with the passed nth function', function () {
    const iter = sequence((n) => (n * 2) - 1, 4)
    assert.deepStrictEqual(take(iter), [-1, 1, 3, 5])
  })

  it('returns an infinite iterator if no length is passed', function () {
    const iter = sequence((n) => (n * 2) - 1)
    assert.deepStrictEqual(take(iter, 500).length, 500)
  })
})

describe('arrange', function () {
  describe('only stop', function () {
    it('returns an empty iterator when stop is 0', function () {
      assert.deepStrictEqual(take(arrange(0)), [])
    })

    it('returns consecutive numbers from 0 to stop - 1 when stop is a positive integer', function () {
      assert.deepStrictEqual(take(arrange(3)), [0, 1, 2])
    })

    it('returns an empty iterator when stop is negative', function () {
      assert.deepStrictEqual(take(arrange(-3)), [])
    })

    it('returns consecutive numbers from 0 to floor(stop) when stop is not an integer', function () {
      assert.deepStrictEqual(take(arrange(3.3)), [0, 1, 2, 3])
    })
  })

  describe('start and stop', function () {
    it('returns an empty iterator when start is equal to stop', function () {
      assert.deepStrictEqual(take(arrange(2, 2)), [])
    })

    it('returns consecutive numbers from start to stop - 1 when start and stop are positive integers with stop > start', function () {
      assert.deepStrictEqual(take(arrange(-2, 3)), [-2, -1, 0, 1, 2])
    })

    it('returns an empty iterator when stop < start', function () {
      assert.deepStrictEqual(take(arrange(3, 1)), [])
    })

    it('returns numbers from start to stop with a step of 1 when start and stop are not integers', function () {
      assert.deepStrictEqual(take(arrange(1.1, 3.3)), [1.1, 2.1, 3.1])
    })

    it('never includes stop when start and stop are not integers', function () {
      assert.deepStrictEqual(take(arrange(1.1, 3.1)), [1.1, 2.1])
    })
  })

  describe('start, stop and step', function () {
    it('throws when step is 0', function () {
      assert.throws(() => { take(arrange(1, 3, 0)) })
    })

    it('returns numbers from start to stop - 1 with step when start and stop are positive integers with stop > start', function () {
      assert.deepStrictEqual(take(arrange(-2, 4, 1.5)), [-2, -0.5, 1, 2.5])
    })

    it('can go backwards if stop < start and step < 0', function () {
      assert.deepStrictEqual(take(arrange(3, -2, -2)), [3, 1, -1])
    })

    it('returns an empty iterator when step is < 0 and stop > start', function () {
      assert.deepStrictEqual(take(arrange(1, 3, -1)), [])
    })

    it('returns an empty iterator when step is > 0 and stop < start', function () {
      assert.deepStrictEqual(take(arrange(3, 1, 1)), [])
    })
  })
})

import assert from 'node:assert'
import { describe, it } from 'node:test'

import { arange, take } from '../lib/'

describe('arange', function () {
  describe('only stop', function () {
    it('returns an empty lazy array when stop is 0', function () {
      assert.deepStrictEqual(take(arange(0)), [])
    })

    it('returns consecutive numbers from 0 to stop - 1 when stop is a positive integer', function () {
      assert.deepStrictEqual(take(arange(3)), [0, 1, 2])
    })

    it('returns an empty lazy array when stop is negative', function () {
      assert.deepStrictEqual(take(arange(-3)), [])
    })

    it('returns consecutive numbers from 0 to floor(stop) when stop is not an integer', function () {
      assert.deepStrictEqual(take(arange(3.3)), [0, 1, 2, 3])
    })
  })

  describe('start and stop', function () {
    it('returns an empty lazy array when start is equal to stop', function () {
      assert.deepStrictEqual(take(arange(2, 2)), [])
    })

    it('returns consecutive numbers from start to stop - 1 when start and stop are positive integers with stop > start', function () {
      assert.deepStrictEqual(take(arange(-2, 3)), [-2, -1, 0, 1, 2])
    })

    it('returns an empty array when stop < start', function () {
      assert.deepStrictEqual(take(arange(3, 1)), [])
    })

    it('returns numbers from start to stop with a step of 1 when start and stop are not integers', function () {
      assert.deepStrictEqual(take(arange(1.1, 3.3)), [1.1, 2.1, 3.1])
    })

    it('never includes stop when start and stop are not integers', function () {
      assert.deepStrictEqual(take(arange(1.1, 3.1)), [1.1, 2.1])
    })
  })

  describe('start, stop and step', function () {
    it('throws when step is 0', function () {
      assert.throws(() => { take(arange(1, 3, 0)) })
    })

    it('returns numbers from start to stop - 1 with step when start and stop are positive integers with stop > start', function () {
      assert.deepStrictEqual(take(arange(-2, 4, 1.5)), [-2, -0.5, 1, 2.5])
    })

    it('can go backwards if stop < start and step < 0', function () {
      assert.deepStrictEqual(take(arange(3, -2, -2)), [3, 1, -1])
    })

    it('returns an empty lazy array when step is < 0 and stop > start', function () {
      assert.deepStrictEqual(take(arange(1, 3, -1)), [])
    })

    it('returns an empty lazy array when step is > 0 and stop < start', function () {
      assert.deepStrictEqual(take(arange(3, 1, 1)), [])
    })
  })
})

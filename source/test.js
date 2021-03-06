import { describe, Try, createStream, countKeys } from './riteway';
import render from './render-component';
import tape from 'tape';
import React from 'react';
import deepEqual from 'deep-equal'

// a function to test
const sum = (...args) => {
  if (args.some(v => Number.isNaN(v))) throw new TypeError('NaN');
  return args.reduce((acc, n) => acc + n, 0);
};

describe('sum()', async assert => {
  const should = 'return the correct sum';

  assert({
    given: 'no arguments',
    should: 'return 0',
    actual: sum(),
    expected: 0
  });

  assert({
    given: 'zero',
    should,
    actual: sum(2, 0),
    expected: 2
  });

  assert({
    given: 'negative numbers',
    should,
    actual: sum(1, -4),
    expected: -3
  });

  assert({
    given: 'NaN',
    should: 'throw',
    actual: Try(sum, 1, NaN),
    expected: new TypeError('NaN')
  });
});

describe('describe()', (assert, end) => {
  setTimeout(() => {
    assert({
      given: 'TestFunction using end()',
      should: 'pass end()',
      actual: typeof end,
      expected: 'function'
    });
  }, 20);

  setTimeout(() => {
    end();
  }, 50);
});

describe('createStream()', async assert => {
  assert({
    given: 'typeof check',
    should: 'be a function',
    actual: typeof createStream,
    expected: 'function'
  });
});

describe('Try()', async assert => {
  {
    const error = new Error('ooops');
    assert({
      given: 'an async function that throws',
      should: 'await and return the value of the error',
      actual: (await Try(async () => { throw error; }, 'irrelivant')).toString(),
      expected: error.toString()
    });
  }
});

describe('assert()', async assert => {
  assert({
    given: 'some key is undefined',
    should: 'not throw',
    actual: undefined,
    expected: undefined
  });

  {
    try {
      assert({});
    } catch (error) {
      assert({
        given: 'calling `assert` with missing keys',
        should: 'throw with missing keys',
        actual: error.message,
        expected: 'The following parameters are required by `assert`: given, should, actual, expected',
      });
    }
  }

  {
    try {
      assert({ given: 'some keys', should: 'find the missing keys' });
    } catch (error) {
      assert({
        given: 'calling `assert` with missing keys',
        should: 'throw with missing keys',
        actual: error.message,
        expected: 'The following parameters are required by `assert`: actual, expected',
      });
    }
  }
});

describe('skip()', async assert => {
  assert({
    given: 'describe.skip',
    should: 'be equal to tape.skip',
    actual: describe.skip === tape.skip,
    expected: true
  });
});

describe('renderComponent', async assert => {
  const text = 'Foo';
  const $ = render(<div className="foo">{text}</div>);

  assert({
    given: 'A react component',
    should: 'return a working cheerio instance',
    actual: $('.foo').html().trim(),
    expected: text
  });
});

describe('countKeys()', async assert => {
  assert({
    given: 'an object',
    should: 'return the number of own props in the object',
    actual: countKeys({ a: 'a', b: 'b', c: 'c' }),
    expected: 3
  });
});

describe('array-object-compare bug fixed via deep-equal v2.0.1',async (assert, _, t) => {
  assert({
    given: 'an array and an object',
    should: 'not be equal',
    actual: deepEqual({}, []),
    expected: false
  });

  assert({
    given: 'another example',
    should: 'not be equal',
    actual: deepEqual({ 0: 'foo' }, ['foo']),
    expected: false
  });
});

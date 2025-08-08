const assert = require('node:assert');
const fizzBuzz = require('./fizzbuzz');

assert.strictEqual(fizzBuzz(3), 'Fizz');
assert.strictEqual(fizzBuzz(5), 'Buzz');
assert.strictEqual(fizzBuzz(15), 'FizzBuzz');
assert.strictEqual(fizzBuzz(7), '7');

console.log('All tests passed!');

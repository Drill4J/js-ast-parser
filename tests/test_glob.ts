import test from 'ava';
import fs from 'fast-glob'

test('test can find MethodDefinition', t => {
    const entries = fs.sync('./fixtures/sourceMaps/main.*.js.map')

    t.is(entries.length, 1)
    t.is(entries[0], "./fixtures/sourceMaps/main.160f53913e3240b7a9b7.js.map")
})
const { AstParser } = require("../src/parser");

const test = require('ava');

test("test", t => {
    const parser = new AstParser()
    const ast = parser.parse("./tests/test-data/original/episode.ts")
    console.log()
})
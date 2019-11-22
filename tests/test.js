const test = require('ava');

test("test", t => {
    
    const parser = new AstParser()

    const ast = parser.parse("./tests/test-data/episode.ts")
    
})
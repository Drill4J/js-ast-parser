const test = require('ava');

test("test", t => {
    const a = 'hello world'
    console.log(a)

    const parser = new AstParser()
    const ast = parser.parse("./tests/test-data/episode.ts")
    
})
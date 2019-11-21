import { readFileSync } from "fs-extra"
import { AstParser } from ".."

const oldAst = JSON.parse(readFileSync('./data/ast.json'))

const parser = new AstParser("./tests/test-data/episode_fixed.ts")

const newAst = parser.parse()

console.log(JSON.stringify(oldAst) === JSON.stringify(newAst))
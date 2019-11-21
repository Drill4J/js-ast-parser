import { readFileSync } from "fs-extra"
import { AstParser } from "../parser"
import { DataExtractor } from "../extractor"
import { DeepDiff } from 'deep-diff';
import differenceBy from 'lodash/differenceBy'

const oldAst = JSON.parse(readFileSync('./data/ast.json'))

const parser = new AstParser("./tests/test-data/episode_fixed.ts")

const newAst = parser.parse()



if(JSON.stringify(oldAst) !== JSON.stringify(newAst)){

    const extractor = new DataExtractor(); 

    const newData = extractor.getClassMethods(newAst)
 
    const oldData = extractor.getClassMethods(oldAst) 

    console.log(newData.methods.length)
    console.log(oldData.methods.length)

    const names1 = newData.methods.map( it => it.name)
    const names2 = oldData.methods.map( it => it.name)

    console.log(names1)
    console.log(names2)
}
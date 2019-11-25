// import { readFileSync } from "fs-extra"
// import { AstParser } from "../src/parser"
// import { DataExtractor } from "../src/extractor"
// import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';

// const oldAst = JSON.parse(readFileSync('./data/ast.json'))

// const parser = new AstParser("./tests/test-data/episode_fixed.ts")

// const newAst = parser.parse()



// if(JSON.stringify(oldAst) !== JSON.stringify(newAst)){

//     const extractor = new DataExtractor(); 

//     const newData = extractor.getClassMethods(newAst)
 
//     const oldData = extractor.getClassMethods(oldAst) 

//     //console.log(newData.methods)
//     //console.log(oldData.methods)

//     const names1 = newData.methods.map(it => it.name.trim())
//     const names2 = oldData.methods.map(it => it.name.trim())

//     console.log(names1)

//     let difference = names1
//                  .filter(x => !names2.includes(x))
//                  .concat(names2.filter(x => !names1.includes(x)));

//     console.log(difference)

//     const diff = deletedDiff(oldData.methods, newData.methods)

//     console.log(JSON.stringify(diff, null, 2))

// }
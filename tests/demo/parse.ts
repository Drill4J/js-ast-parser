import { parseFiles } from "src";

// import { AstParser } from "../src/parser"
// import { extractMethods } from "../src/analyzers/extract_all_methods"
// import { extractMethodName } from "../src/analyzers/extract_method_name"
// import { extractMethodParams } from "../src/analyzers/extract_method_params"
// import { extractClassName } from "../src/analyzers/extract_class_name"
// import { writeJson, emptyDirSync } from "fs-extra"
// import { DataExtractor } from "../src/extractor"

// const parser = new AstParser()

// const ast = parser.parse("./tests/test-data/original/episode.ts")

// const newAst = parser.parse("./tests/test-data/new/episode.ts")

// const extractor = new DataExtractor(); 

// const data = extractor.getClassMethods(ast)
// const newData = extractor.getClassMethods(newAst)

// function writeFile(name, object){
//     writeJson(name, object, {spaces:2}, err => {
//         if (err) return console.error(err)
      
//         console.log('success!')
//       })
// }

// console.log(JSON.stringify(data, null, 2))

// emptyDirSync('./data')

// writeFile('./data/result.json', data)
// writeFile('./data/result2.json', newData)
// writeFile('./data/ast.json', ast)
// writeFile('./data/newAst.json', newAst)

parseFiles("/home/sergey/Github/todomvc/examples/typescript-angular/js", "", "")
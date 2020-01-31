import { AstParser } from "../../src/parser";
import { DataExtractor } from "../../src/extractor";

const parser = new AstParser()
const extractor = new DataExtractor();

describe('statements count', () => {
  test('count statements for method definition', () => {
    const source = `class Test {
        newMethod(name: string){
            console.log(name)
            const a = 5;
          
            const b = extract()
            
            const c =() => {
            
            
            }
            
            return 5
        }
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    expect(data.methods.length === 1)

    const method = data.methods[0]
    expect(method.statements).toEqual([3, 4, 6, 8, 11, 13])
  });

  test('count statements for static method', ()=>{

    const source = `class Test {
        static newMethod(name: string){
            console.log(name)
            const a = 5;
          
            const b = extract()
            
            const c =() => {
            
            
            }
            
            return 5
        }
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    expect(data.methods.length === 1)

    const method = data.methods[0]
    expect(method.statements).toEqual([3, 4, 6, 8, 11, 13])
  })
});

import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";

// TODO refactor that
export function extract(params){
    let result = [];

    params.forEach(p => {
        if(p.type === AST_NODE_TYPES.Identifier){
            result.push(p.name)
        }
        else if(p.type === AST_NODE_TYPES.RestElement && p.argument.type === AST_NODE_TYPES.Identifier){
            result.push(p.argument.name)
        }
        else if(p.type === AST_NODE_TYPES.SequenceExpression){
            p.expressions.forEach(exp => {
                if(exp.type === AST_NODE_TYPES.Identifier){
                    result.push(exp.name)
                }
                else if (exp.type === AST_NODE_TYPES.ObjectExpression) {
                    exp.properties.forEach(prop => {
                        if(prop.type === AST_NODE_TYPES.Property){
                            result.push(prop.key.name)
                        }
                    })
                }
            })
        }
        else if(p.type === AST_NODE_TYPES.ArrowFunctionExpression){
            p.params.forEach(param => {
                if(param.type === AST_NODE_TYPES.Identifier){
                    result.push(param.name)
                }
                else if (param.type === AST_NODE_TYPES.ObjectPattern){
                    const properties = []
                    param.properties.forEach(prop => {
                        if(prop.type === AST_NODE_TYPES.Property){
                            properties.push(prop.key.name)
                        }
                    })
                    result.push(`{ ${properties.join(", ")} }`)
                }
            })
        }
        else if(p.type === AST_NODE_TYPES.CallExpression){
            result.push(...extract(p.arguments))
        }
        else if(p.type === AST_NODE_TYPES.AssignmentPattern){
            result.push(p.left.name)
        }
    })


    return result
}
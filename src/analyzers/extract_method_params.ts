import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Parameter } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

export function extractMethodParams(method){
    let params = [];
    if(method.type === AST_NODE_TYPES.MethodDefinition){
        return extract(method.value.params)
    }
    else if(method.type === AST_NODE_TYPES.FunctionDeclaration){
        return extract(method.params)
    }
    else if(method.type === AST_NODE_TYPES.ArrowFunctionExpression){
        return extract(method.params)
    }
    else if(method.type === AST_NODE_TYPES.FunctionExpression){
        return extract(method.params)
    }

    return params;
}

function extract(params: Parameter[]){
    let result = [];

    params.forEach(p => {
        if(p.type === AST_NODE_TYPES.Identifier){
            result.push(p.name)
        }
        else if(p.type === AST_NODE_TYPES.RestElement && p.argument.type === AST_NODE_TYPES.Identifier){
            result.push(p.argument.name)
        }
    })


    return result
}
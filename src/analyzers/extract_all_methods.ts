import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, Program } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { extractMethodParams } from "./extract_method_params";
import { deleteLocationData } from "./delete_location_data";
import { Astmethod } from "../item/ast_method";
import { getFunctionName, MainMethod } from "./helpers";

function visitCallExpression(node){
    // filter for const Icon = singleBar.icon('div');
    const args = node.init.arguments.filter(it => { 
        return it.type === AST_NODE_TYPES.ArrowFunctionExpression || 
        it.type === AST_NODE_TYPES.SequenceExpression || 
        it.type === AST_NODE_TYPES.CallExpression 
    })

    if(args.length == 0){
        return null
    }

    const method = new Astmethod()

    if(node.id && node.id.type == AST_NODE_TYPES.Identifier){
        method.name = node.id.name
    }
    
    node.init.arguments.forEach(arg => {
        if(arg.type === AST_NODE_TYPES.ArrowFunctionExpression){
            arg.params.forEach(param => {
                if(param.type === AST_NODE_TYPES.Identifier){
                    method.params.push(param.name)
                }
                else if (param.type === AST_NODE_TYPES.ObjectPattern){
                    const properties = []
                    param.properties.forEach(prop => {
                        if(prop.type === AST_NODE_TYPES.Property){
                            properties.push(prop.key.name)
                      }
                    })
                    method.params.push(`{ ${properties.join(", ")} }`)
                }
            })
        }
        else if(arg.type === AST_NODE_TYPES.SequenceExpression){
            arg.expressions.forEach(exp => {
                if(exp.type === AST_NODE_TYPES.Identifier){
                    method.params.push(exp.name)
                }
                else if (exp.type === AST_NODE_TYPES.ObjectExpression) {
                    exp.properties.forEach(prop => {
                        if(prop.type === AST_NODE_TYPES.Property){
                            method.params.push(prop.key.name)
                        }
                    })
                }
            })
        }
        else if(arg.type === AST_NODE_TYPES.CallExpression){
            arg.arguments.forEach(arg => {
                if(arg.type === AST_NODE_TYPES.ArrowFunctionExpression){
                    arg.params.forEach(param => {
                        if(param.type === AST_NODE_TYPES.Identifier){
                            method.params.push(param.name)
                        }
                        else if (param.type === AST_NODE_TYPES.ObjectPattern){
                            const properties = []
                            param.properties.forEach(prop => {
                                if(prop.type === AST_NODE_TYPES.Property){
                                    properties.push(prop.key.name)
                              }
                            })
                            method.params.push(`{ ${properties.join(", ")} }`)
                        }
                    })
                }
            })
        }

    });

    method.loc = node.init.loc
    method.body = deleteLocationData(node.init)

    return method;
}

export function extractMethods(program: Program){
    const methods: Astmethod[] = [] 
    traverser.traverse(program, {
        enter(node: Node) {
            switch(node.type){
                // class Foo {
                //   name() {}
                // }
                case AST_NODE_TYPES.MethodDefinition:
                    this.skip()
                    methods.push(extractMethodData(node))
                    break;

                // function name() {}
                case AST_NODE_TYPES.FunctionDeclaration:
                    this.skip()
                    methods.push(extractMethodData(node))
                    break;

                case AST_NODE_TYPES.VariableDeclaration:
                    this.skip()
                    methods.push(processVariableDeclaration(node))   
            }}})

    return methods.filter(it => it != null)
}

function extractMethodData(node: MainMethod) : Astmethod{
    const method = new Astmethod()
    method.name = getFunctionName(node)
    method.loc = node.loc
    method.params = extractMethodParams(node)
    method.body = deleteLocationData(node)
    
    return method
}

function visitFunctionExpression(node){
    const method = new Astmethod()

    method.name = getFunctionName(node)
    method.params = extractMethodParams(node.init)
    method.loc = node.loc
    method.body = deleteLocationData(node.init)

    return method;
}

function processVariableDeclaration(node){
    let result = null;
    traverser.traverse(node, {
        enter(innerNode: Node) {
          switch(innerNode.type) {
            case AST_NODE_TYPES.VariableDeclarator:
                // const name = () => {}
                if (innerNode.init.type === AST_NODE_TYPES.ArrowFunctionExpression) {
                    result = visitFunctionExpression(innerNode)
                    this.break();
                }
                //const name = function() {}
                else if (innerNode.init.type === AST_NODE_TYPES.FunctionExpression) {
                    result = visitFunctionExpression(innerNode)
                    this.break();
                }
                // const hello = dashboard((name, { title, agent })
                else if (innerNode.init.type === AST_NODE_TYPES.CallExpression){
                    result = visitCallExpression(innerNode)
                    this.break();
              }

            break;
        }
    }});

    return result
}
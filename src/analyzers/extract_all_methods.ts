import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, Program } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { extractMethodParams } from "./extract_method_params";
import { deleteLocationData } from "./delete_location_data";
import { Astmethod } from "../item/ast_method";
import { getFunctionName, MainMethod } from "./helpers";

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
                    break;
                case AST_NODE_TYPES.ClassProperty:
                    this.skip()
                    methods.push(processClassProperty(node))
                    break;   
            }}})

    return methods.filter(it => it != null)
}

function processClassProperty(node){
    if(!node.static || node.key.type !== AST_NODE_TYPES.Identifier){
        return null              
    }
    const method = new Astmethod()

    method.name = getFunctionName(node)
    method.loc = node.loc
    method.body = deleteLocationData(node)
    method.params = extractMethodParams(node.value)

    return method
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

function visitCallExpression(node){
    if(node.init.callee.type !== AST_NODE_TYPES.MemberExpression && node.init.callee.type !== AST_NODE_TYPES.Identifier){
        return null
    }
    
    const method = new Astmethod()

    method.name = getFunctionName(node)
    method.params = extractMethodParams(node.init)

    method.loc = node.init.loc
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
                // const hello = dashboard((name, { title, agent }))
                else if (innerNode.init.type === AST_NODE_TYPES.CallExpression){
                    result = visitCallExpression(innerNode)
                    this.break();
              }

            break;
        }
    }});

    return result
}
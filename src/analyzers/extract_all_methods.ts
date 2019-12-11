import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, MethodDefinition, Program, FunctionDeclaration, ArrowFunctionExpression, FunctionExpression, ExportNamedDeclaration } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { Astmethod } from "src/model/method";
import { extractMethodParams } from "./extract_method_params";
import { deleteLocationData } from "./delete_location_data";
import { METHODS } from "http";

export type MainMethod = FunctionDeclaration | MethodDefinition | ExportNamedDeclaration | ArrowFunctionExpression | FunctionExpression

function processMethodDefinitiion(node: MethodDefinition){
    const method = new Astmethod()
    if(node.key.type == AST_NODE_TYPES.Identifier){
        method.name = node.key.name
    }

    method.params = extractMethodParams(node)
    method.loc = node.loc
    method.body = deleteLocationData(node)

    return method
}

function processFunctionDeclaration(node: FunctionDeclaration){
    const method = new Astmethod()
    if(node.id && node.id.type == AST_NODE_TYPES.Identifier){
        method.name = node.id.name
    }

    node.params.forEach(param => {
        if(param.type == AST_NODE_TYPES.Identifier){
           method.params.push(param.name)
        }
    });

    method.loc = node.loc
    method.body = deleteLocationData(node)

    return method
}

function visitFunctionExpression(node){
    const method = new Astmethod()

    node.init.params.forEach(param => {
        if(param.type == AST_NODE_TYPES.Identifier){
            method.params.push(param.name)
         }
    })

    if(node.id && node.id.type == AST_NODE_TYPES.Identifier){
        method.name = node.id.name
    }
    
    method.loc = node.init.loc
    method.body = deleteLocationData(node.init)

    return method;
}

function processFunctionExpression(node){
    let result;
    traverser.traverse(node, {
        enter(innerNode: Node) {
          switch(innerNode.type) {
            case AST_NODE_TYPES.VariableDeclarator:
                // const name = () => {}
                if (innerNode.init.type === AST_NODE_TYPES.ArrowFunctionExpression) {
                    result = visitFunctionExpression(innerNode)
                    this.break()
                }
                //const name = function() {}
                else if (innerNode.init.type === AST_NODE_TYPES.FunctionExpression) {
                    result = visitFunctionExpression(innerNode)
                    this.break()
                }
            break;
        }
    }});

    return result
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
                    methods.push(processMethodDefinitiion(node))
                    break;

                // function name() {}
                case AST_NODE_TYPES.FunctionDeclaration:
                    methods.push(processFunctionDeclaration(node))
                    this.break()
                    break;

                case AST_NODE_TYPES.VariableDeclaration:
                    this.skip()
                    methods.push(processFunctionExpression(node))   
            }}})
    return methods
}
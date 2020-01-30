import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, Program, ObjectExpression, Property } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { extractMethodParams } from "./extract_method_params";
import { deleteLocationData } from "./delete_location_data";
import { Astmethod } from "../model/ast_method";
import { getFunctionName, MainMethod } from "./helpers";
import { extractStatements } from "./method_statements";

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

                // const Logo = logo.demo({})
                case AST_NODE_TYPES.VariableDeclaration:
                    this.skip()
                    methods.push(processVariableDeclaration(node))
                    break;
                
                // class Foo {
                //   static name = () => {}
                //   static name = name() {}
                //   static name = function name() {}
                // }    
                case AST_NODE_TYPES.ClassProperty:
                    this.skip()
                    methods.push(processClassProperty(node))
                    break;
                
                // export default {
                //   name: () => {}
                // }
                case AST_NODE_TYPES.ExportDefaultDeclaration:
                    if (node.declaration.type as string === AST_NODE_TYPES.ObjectExpression) {
                        this.skip()
                        Array.prototype.push.apply(methods, processObjectProperties(node))
                    }
                    break;
            }}})

    return methods.filter(it => it != null)
}

function processObjectProperties(node){
    const methods = []
    const objectNode = node.declaration as unknown as ObjectExpression

    const properties = objectNode.properties.filter(
        property => {
           return property.type === AST_NODE_TYPES.Property
        && property.key.type === AST_NODE_TYPES.Identifier
        && property.value.type !== AST_NODE_TYPES.AssignmentPattern}
      ) as Property[] | undefined

    if (properties.length == 0) {
        return null
    }

    properties.forEach(prop => {
        const method = new Astmethod()
        method.statements = extractStatements(prop)
        method.name = getFunctionName(prop)
        method.loc = prop.loc
        method.body = deleteLocationData(prop)
        method.params = extractMethodParams(prop.value)

        methods.push(method)
    });

    return methods
}

function processClassProperty(node){
    if(!node.value || node.value.type === AST_NODE_TYPES.Literal || node.key.type !== AST_NODE_TYPES.Identifier){
        return null              
    }
    const method = new Astmethod()

    method.statements = extractStatements(node)
    method.name = getFunctionName(node)
    method.loc = node.loc
    method.body = deleteLocationData(node)
    method.params = extractMethodParams(node.value)

    return method
}

function extractMethodData(node: MainMethod) : Astmethod{
    const method = new Astmethod()
    method.name = getFunctionName(node)
    method.statements = extractStatements(node)
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
                if (innerNode.init && innerNode.init.type === AST_NODE_TYPES.ArrowFunctionExpression) {
                    result = visitFunctionExpression(innerNode)
                    this.break();
                }
                //const name = function() {}
                else if (innerNode.init && innerNode.init.type === AST_NODE_TYPES.FunctionExpression) {
                    result = visitFunctionExpression(innerNode)
                    this.break();
                }
                // const hello = dashboard((name, { title, agent }))
                else if (innerNode.init && innerNode.init.type === AST_NODE_TYPES.CallExpression){
                    result = visitCallExpression(innerNode)
                    this.break();
              }

            break;
        }
    }});

    return result
}
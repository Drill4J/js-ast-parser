"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const traverser_1 = __importDefault(require("eslint/lib/shared/traverser"));
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const extract_method_params_1 = require("./extract_method_params");
const delete_location_data_1 = require("./delete_location_data");
const ast_method_1 = require("../model/ast_method");
const helpers_1 = require("./helpers");
const method_statements_1 = require("./method_statements");
function extractMethods(program) {
    const methods = [];
    traverser_1.default.traverse(program, {
        enter(node) {
            switch (node.type) {
                // class Foo {
                //   name() {}
                // }
                case typescript_estree_1.AST_NODE_TYPES.MethodDefinition:
                    this.skip();
                    methods.push(extractMethodData(node));
                    break;
                // function name() {}
                case typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration:
                    this.skip();
                    methods.push(extractMethodData(node));
                    break;
                // const Logo = logo.demo({})
                case typescript_estree_1.AST_NODE_TYPES.VariableDeclaration:
                    this.skip();
                    methods.push(processVariableDeclaration(node));
                    break;
                // class Foo {
                //   static name = () => {}
                //   static name = name() {}
                //   static name = function name() {}
                // }    
                case typescript_estree_1.AST_NODE_TYPES.ClassProperty:
                    this.skip();
                    methods.push(processClassProperty(node));
                    break;
                // export default {
                //   name: () => {}
                // }
                case typescript_estree_1.AST_NODE_TYPES.ExportDefaultDeclaration:
                    if (node.declaration.type === typescript_estree_1.AST_NODE_TYPES.ObjectExpression) {
                        this.skip();
                        Array.prototype.push.apply(methods, processObjectProperties(node));
                    }
                    break;
            }
        }
    });
    return methods.filter(it => it != null);
}
exports.extractMethods = extractMethods;
function processObjectProperties(node) {
    const methods = [];
    const objectNode = node.declaration;
    const properties = objectNode.properties.filter(property => {
        return property.type === typescript_estree_1.AST_NODE_TYPES.Property
            && property.key.type === typescript_estree_1.AST_NODE_TYPES.Identifier
            && property.value.type !== typescript_estree_1.AST_NODE_TYPES.AssignmentPattern;
    });
    if (properties.length == 0) {
        return null;
    }
    properties.forEach(prop => {
        const method = new ast_method_1.Astmethod();
        method.statements = method_statements_1.extractStatements(prop);
        method.name = helpers_1.getFunctionName(prop);
        method.loc = prop.loc;
        method.body = delete_location_data_1.deleteLocationData(prop);
        method.params = extract_method_params_1.extractMethodParams(prop.value);
        methods.push(method);
    });
    return methods;
}
function processClassProperty(node) {
    if (!node.value || node.value.type === typescript_estree_1.AST_NODE_TYPES.Literal || node.key.type !== typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return null;
    }
    const method = new ast_method_1.Astmethod();
    method.statements = method_statements_1.extractStatements(node);
    method.name = helpers_1.getFunctionName(node);
    method.loc = node.loc;
    method.body = delete_location_data_1.deleteLocationData(node);
    method.params = extract_method_params_1.extractMethodParams(node.value);
    return method;
}
function extractMethodData(node) {
    const method = new ast_method_1.Astmethod();
    method.name = helpers_1.getFunctionName(node);
    method.statements = method_statements_1.extractStatements(node);
    method.loc = node.loc;
    method.params = extract_method_params_1.extractMethodParams(node);
    method.body = delete_location_data_1.deleteLocationData(node);
    return method;
}
function visitFunctionExpression(node) {
    const method = new ast_method_1.Astmethod();
    method.name = helpers_1.getFunctionName(node);
    method.params = extract_method_params_1.extractMethodParams(node.init);
    method.loc = node.loc;
    method.body = delete_location_data_1.deleteLocationData(node.init);
    return method;
}
function visitCallExpression(node) {
    if (node.init.callee.type !== typescript_estree_1.AST_NODE_TYPES.MemberExpression && node.init.callee.type !== typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return null;
    }
    const method = new ast_method_1.Astmethod();
    method.name = helpers_1.getFunctionName(node);
    method.params = extract_method_params_1.extractMethodParams(node.init);
    method.loc = node.init.loc;
    method.body = delete_location_data_1.deleteLocationData(node.init);
    return method;
}
function processVariableDeclaration(node) {
    let result = null;
    traverser_1.default.traverse(node, {
        enter(innerNode) {
            switch (innerNode.type) {
                case typescript_estree_1.AST_NODE_TYPES.VariableDeclarator:
                    // const name = () => {}
                    if (innerNode.init && innerNode.init.type === typescript_estree_1.AST_NODE_TYPES.ArrowFunctionExpression) {
                        result = visitFunctionExpression(innerNode);
                        this.break();
                    }
                    //const name = function() {}
                    else if (innerNode.init && innerNode.init.type === typescript_estree_1.AST_NODE_TYPES.FunctionExpression) {
                        result = visitFunctionExpression(innerNode);
                        this.break();
                    }
                    // const hello = dashboard((name, { title, agent }))
                    else if (innerNode.init && innerNode.init.type === typescript_estree_1.AST_NODE_TYPES.CallExpression) {
                        result = visitCallExpression(innerNode);
                        this.break();
                    }
                    break;
            }
        }
    });
    return result;
}
//# sourceMappingURL=extract_all_methods.js.map
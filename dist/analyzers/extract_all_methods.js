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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdF9hbGxfbWV0aG9kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbmFseXplcnMvZXh0cmFjdF9hbGxfbWV0aG9kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRFQUFxRDtBQUNyRCw0RUFBc0U7QUFFdEUsbUVBQThEO0FBQzlELGlFQUE0RDtBQUM1RCxvREFBZ0Q7QUFDaEQsdUNBQXdEO0FBQ3hELDJEQUF3RDtBQUV4RCxTQUFnQixjQUFjLENBQUMsT0FBZ0I7SUFDM0MsTUFBTSxPQUFPLEdBQWdCLEVBQUUsQ0FBQTtJQUMvQixtQkFBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDeEIsS0FBSyxDQUFDLElBQVU7WUFDWixRQUFPLElBQUksQ0FBQyxJQUFJLEVBQUM7Z0JBQ2IsY0FBYztnQkFDZCxjQUFjO2dCQUNkLElBQUk7Z0JBQ0osS0FBSyxrQ0FBYyxDQUFDLGdCQUFnQjtvQkFDaEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO29CQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtvQkFDckMsTUFBTTtnQkFFVixxQkFBcUI7Z0JBQ3JCLEtBQUssa0NBQWMsQ0FBQyxtQkFBbUI7b0JBQ25DLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtvQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7b0JBQ3JDLE1BQU07Z0JBRVYsNkJBQTZCO2dCQUM3QixLQUFLLGtDQUFjLENBQUMsbUJBQW1CO29CQUNuQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7b0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO29CQUM5QyxNQUFNO2dCQUVWLGNBQWM7Z0JBQ2QsMkJBQTJCO2dCQUMzQiw0QkFBNEI7Z0JBQzVCLHFDQUFxQztnQkFDckMsUUFB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
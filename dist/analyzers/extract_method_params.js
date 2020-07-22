"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
function extractMethodParams(method) {
    let params = [];
    if (!method) {
        return [];
    }
    if (method.type === typescript_estree_1.AST_NODE_TYPES.MethodDefinition) {
        return extract(method.value.params);
    }
    else if (method.type === typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration ||
        method.type === typescript_estree_1.AST_NODE_TYPES.FunctionExpression ||
        method.type === typescript_estree_1.AST_NODE_TYPES.ArrowFunctionExpression) {
        return extract(method.params);
    }
    else if (method.type === typescript_estree_1.AST_NODE_TYPES.CallExpression) {
        return extract(method.arguments);
    }
    return params;
}
exports.extractMethodParams = extractMethodParams;
function extract(params) {
    let result = [];
    params.forEach(p => {
        if (p.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
            result.push(p.name);
        }
        else if (p.type === typescript_estree_1.AST_NODE_TYPES.RestElement && p.argument.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
            result.push(p.argument.name);
        }
        else if (p.type === typescript_estree_1.AST_NODE_TYPES.SequenceExpression) {
            p.expressions.forEach(exp => {
                if (exp.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
                    result.push(exp.name);
                }
                else if (exp.type === typescript_estree_1.AST_NODE_TYPES.ObjectExpression) {
                    exp.properties.forEach(prop => {
                        if (prop.type === typescript_estree_1.AST_NODE_TYPES.Property) {
                            result.push(prop.key.name);
                        }
                    });
                }
            });
        }
        else if (p.type === typescript_estree_1.AST_NODE_TYPES.ArrowFunctionExpression) {
            p.params.forEach(param => {
                if (param.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
                    result.push(param.name);
                }
                else if (param.type === typescript_estree_1.AST_NODE_TYPES.ObjectPattern) {
                    const properties = [];
                    param.properties.forEach(prop => {
                        if (prop.type === typescript_estree_1.AST_NODE_TYPES.Property) {
                            properties.push(prop.key.name);
                        }
                    });
                    result.push(`{ ${properties.join(", ")} }`);
                }
            });
        }
        else if (p.type === typescript_estree_1.AST_NODE_TYPES.CallExpression) {
            result.push(...extract(p.arguments));
        }
        else if (p.type === typescript_estree_1.AST_NODE_TYPES.AssignmentPattern) {
            result.push(p.left.name);
        }
    });
    return result;
}
//# sourceMappingURL=extract_method_params.js.map
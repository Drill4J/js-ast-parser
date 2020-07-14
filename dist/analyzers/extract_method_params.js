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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdF9tZXRob2RfcGFyYW1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FuYWx5emVycy9leHRyYWN0X21ldGhvZF9wYXJhbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0RUFBc0U7QUFFdEUsU0FBZ0IsbUJBQW1CLENBQUMsTUFBTTtJQUN0QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBRyxDQUFDLE1BQU0sRUFBQztRQUNQLE9BQU8sRUFBRSxDQUFBO0tBQ1o7SUFFRCxJQUFHLE1BQU0sQ0FBQyxJQUFJLEtBQUssa0NBQWMsQ0FBQyxnQkFBZ0IsRUFBQztRQUMvQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3RDO1NBQ0ksSUFBRyxNQUFNLENBQUMsSUFBSSxLQUFLLGtDQUFjLENBQUMsbUJBQW1CO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLEtBQUssa0NBQWMsQ0FBQyxrQkFBa0I7UUFDakQsTUFBTSxDQUFDLElBQUksS0FBSyxrQ0FBYyxDQUFDLHVCQUF1QixFQUFDO1FBQ3ZELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUNoQztTQUNJLElBQUcsTUFBTSxDQUFDLElBQUksS0FBSyxrQ0FBYyxDQUFDLGNBQWMsRUFBQztRQUNsRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7S0FDbkM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBbkJELGtEQW1CQztBQUVELFNBQVMsT0FBTyxDQUFDLE1BQU07SUFDbkIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBRWhCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDZixJQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssa0NBQWMsQ0FBQyxVQUFVLEVBQUM7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxD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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
function getFunctionName(node) {
    let name = "";
    if (node.type === typescript_estree_1.AST_NODE_TYPES.MethodDefinition && node.key.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return node.key.name;
    }
    else if (node.type === typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration && node.id.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return node.id.name;
    }
    else if (node.type === typescript_estree_1.AST_NODE_TYPES.VariableDeclarator && node.id && node.id.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return node.id.name;
    }
    else if (node.type === typescript_estree_1.AST_NODE_TYPES.ClassProperty && node.key.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return node.key.name;
    }
    else if (node.type === typescript_estree_1.AST_NODE_TYPES.Property && node.key.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return node.key.name;
    }
    return name;
}
exports.getFunctionName = getFunctionName;
//# sourceMappingURL=helpers.js.map
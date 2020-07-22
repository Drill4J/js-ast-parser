"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const traverser_1 = __importDefault(require("eslint/lib/shared/traverser"));
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
function extractMethodName(method) {
    let name;
    traverser_1.default.traverse(method, {
        enter(node) {
            if (node.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
                this.break();
                name = node.name;
            }
        }
    });
    return name.trim();
}
exports.extractMethodName = extractMethodName;
//# sourceMappingURL=extract_method_name.js.map
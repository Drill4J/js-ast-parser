"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const traverser_1 = __importDefault(require("eslint/lib/shared/traverser"));
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
function extractStatements(node) {
    const result = new Set();
    traverser_1.default.traverse(node, {
        enter(node) {
            switch (node.type) {
                case typescript_estree_1.AST_NODE_TYPES.BlockStatement:
                    node.body.forEach((statement) => {
                        var _a, _b, _c, _d, _e, _f;
                        const startLine = (_c = (_b = (_a = statement) === null || _a === void 0 ? void 0 : _a.loc) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line;
                        const endLine = (_f = (_e = (_d = statement) === null || _d === void 0 ? void 0 : _d.loc) === null || _e === void 0 ? void 0 : _e.end) === null || _f === void 0 ? void 0 : _f.line;
                        result.add(startLine);
                        result.add(endLine);
                    });
            }
        }
    });
    return Array.from(result);
}
exports.extractStatements = extractStatements;
//# sourceMappingURL=method_statements.js.map
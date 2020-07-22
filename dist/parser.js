"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const fs_extra_1 = __importDefault(require("fs-extra"));
class AstParser {
    constructor() {
        this.options = {
            comment: false,
            jsx: true,
            loc: true,
        };
    }
    parse(sourcePath, includeLocationData = true) {
        const source = fs_extra_1.default.readFileSync(sourcePath, 'utf8');
        return { source: source, ast: this.parseSource(source, includeLocationData) };
    }
    parseSource(source, includeLocationData) {
        this.options.loc = includeLocationData;
        this.options.range = includeLocationData;
        return typescript_estree_1.parse(source, this.options);
    }
}
exports.AstParser = AstParser;
//# sourceMappingURL=parser.js.map
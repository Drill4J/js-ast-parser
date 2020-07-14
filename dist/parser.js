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
    parse(sourcePath) {
        const source = fs_extra_1.default.readFileSync(sourcePath, 'utf8');
        return { source: source, ast: this.parseSource(source) };
    }
    parseSource(source) {
        return typescript_estree_1.parse(source, this.options);
    }
}
exports.AstParser = AstParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRFQUE4RTtBQUM5RSx3REFBMEI7QUFFMUIsTUFBYSxTQUFTO0lBR3BCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLE9BQU8sRUFBRSxLQUFLO1lBQ2QsR0FBRyxFQUFFLElBQUk7WUFDVCxHQUFHLEVBQUUsSUFBSTtTQUNWLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLFVBQWtCO1FBQzdCLE1BQU0sTUFBTSxHQUFHLGtCQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFTSxXQUFXLENBQUMsTUFBYztRQUMvQixPQUFPLHlCQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0Y7QUFuQkQsOEJBbUJDIn0=
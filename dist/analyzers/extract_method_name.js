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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdF9tZXRob2RfbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbmFseXplcnMvZXh0cmFjdF9tZXRob2RfbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRFQUFxRDtBQUVyRCw0RUFBc0U7QUFHdEUsU0FBZ0IsaUJBQWlCLENBQUMsTUFBa0I7SUFDaEQsSUFBSSxJQUFZLENBQUM7SUFDakIsbUJBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLEtBQUssQ0FBQyxJQUFVO1lBQ1osSUFBRyxJQUFJLENBQUMsSUFBSSxJQUFJLGtDQUFjLENBQUMsVUFBVSxFQUFDO2dCQUN2QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7Z0JBQ1osSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7YUFDdEI7UUFDTCxDQUFDO0tBQUMsQ0FBQyxDQUFBO0lBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkIsQ0FBQztBQVZELDhDQVVDIn0=
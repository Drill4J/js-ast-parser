"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const traverser_1 = __importDefault(require("eslint/lib/shared/traverser"));
function deleteLocationData(method) {
    traverser_1.default.traverse(method, {
        enter(node) {
            delete node.loc;
            delete node.range;
        }
    });
    return method;
}
exports.deleteLocationData = deleteLocationData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlX2xvY2F0aW9uX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYW5hbHl6ZXJzL2RlbGV0ZV9sb2NhdGlvbl9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNEVBQXFEO0FBRXJELFNBQWdCLGtCQUFrQixDQUFDLE1BQU07SUFDckMsbUJBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLEtBQUssQ0FBQyxJQUFVO1lBQ1osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO1lBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3JCLENBQUM7S0FDSixDQUFDLENBQUE7SUFDRixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBUkQsZ0RBUUMifQ==
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
//# sourceMappingURL=delete_location_data.js.map
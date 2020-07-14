"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const traverser_1 = __importDefault(require("eslint/lib/shared/traverser"));
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
function extractClassName(program) {
    let name;
    traverser_1.default.traverse(program, {
        enter(node) {
            if (node.type == typescript_estree_1.AST_NODE_TYPES.ClassDeclaration) {
                this.break();
                name = extractName(node);
            }
        }
    });
    return name;
}
exports.extractClassName = extractClassName;
function extractName(classDeclaration) {
    let name;
    traverser_1.default.traverse(classDeclaration, {
        enter(node) {
            if (node.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
                this.break();
                name = node.name;
            }
        }
    });
    return name;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdF9jbGFzc19uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FuYWx5emVycy9leHRyYWN0X2NsYXNzX25hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw0RUFBcUQ7QUFDckQsNEVBQXNFO0FBRXRFLFNBQWdCLGdCQUFnQixDQUFDLE9BQWdCO0lBQzdDLElBQUksSUFBVyxDQUFDO0lBQ2hCLG1CQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN4QixLQUFLLENBQUMsSUFBVTtZQUNaLElBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxrQ0FBYyxDQUFDLGdCQUFnQixFQUFDO2dCQUM1QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7Z0JBQ1osSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUMvQjtRQUNMLENBQUM7S0FBQyxDQUFDLENBQUE7SUFDSCxPQUFPLElBQUksQ0FBQTtBQUNmLENBQUM7QUFWRCw0Q0FVQztBQUVELFNBQVMsV0FBVyxDQUFDLGdCQUFrQztJQUNuRCxJQUFJLElBQVcsQ0FBQztJQUNoQixtQkFBUyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNqQyxLQUFLLENBQUMsSUFBVTtZQUNaLElBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxrQ0FBYyxDQUFDLFVBQVUsRUFBQztnQkFDdEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO2dCQUNaLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO2FBQ3ZCO1FBQ0wsQ0FBQztLQUFDLENBQUMsQ0FBQTtJQUVILE9BQU8sSUFBSSxDQUFBO0FBQ2YsQ0FBQyJ9
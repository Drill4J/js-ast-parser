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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbmFseXplcnMvaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRFQUFzRTtBQUt0RSxTQUFnQixlQUFlLENBQUMsSUFBZ0I7SUFDNUMsSUFBSyxJQUFJLEdBQUcsRUFBRSxDQUFBO0lBQ2QsSUFBRyxJQUFJLENBQUMsSUFBSSxLQUFLLGtDQUFjLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssa0NBQWMsQ0FBQyxVQUFVLEVBQUM7UUFDNUYsT0FBUSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztLQUN6QjtTQUNJLElBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxrQ0FBYyxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLGtDQUFjLENBQUMsVUFBVSxFQUFDO1FBQ25HLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7S0FDdkI7U0FDSSxJQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssa0NBQWMsQ0FBQyxrQkFBa0IsSUFBSyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLGtDQUFjLENBQUMsVUFBVSxFQUFDO1FBQzdHLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7S0FDdEI7U0FDSSxJQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssa0NBQWMsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssa0NBQWMsQ0FBQyxVQUFVLEVBQUM7UUFDOUYsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztLQUN4QjtTQUNJLElBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxrQ0FBYyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxrQ0FBYyxDQUFDLFVBQVUsRUFBQztRQUN6RixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0tBQ3hCO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDZixDQUFDO0FBbkJELDBDQW1CQyJ9
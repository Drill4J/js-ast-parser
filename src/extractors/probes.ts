/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import Traverser from 'eslint/lib/shared/traverser'; // TODO test on TS-specific keys
// import { simpleTraverse } from '@typescript-eslint/typescript-estree/dist/simple-traverse';
import deepClone from 'rfdc';
import { NodeContext } from '../types';

/*
  Reference
  https://docs.google.com/document/d/1wCydi2HEZRF0skDeLb6CH0abZnTyVo5Vz5u-jhwi7es/edit#heading=h.cbfc74c7rx5k
  
  EDGE CASES

  - If a file contains single function, then GLOBAL position ranges match function's position ranges 
  - single function declaration inside ternary operator
      ? impossible to distinguish between branch not being executed and function not being called
  - single function expression inside "if" or "else" branch without body (no curly braces)

  Worrying cases
    From V8 doc: 
      Labeled statements: Can be used as target of labeled continue/breaks.
      Labeled loops can reuse the loop body counter, but for labeled statements we will need a different solution.
      E.g. collect source ranges & generate bytecode iff Block with labels.
      Likewise for SwitchStatement.

  "HARD" cases
    - ternary operators branch probes
      probeSet.add(getStartPosition(node.consequent)); // -1 on column index ?
      probeSet.add(getStartPosition(node.alternate)); // -1 on column index ?
    - if-else if
      ? where to place continuation probe?
    - within logical expressions chain
      ? where to place continuation probe
    - nested ternary operators
      ? where to place continuation probe?

  "block" nodes other than BlockStatement and Program (they have no "body" but still affect execution order)
    LogicalExpression
    ConditionalExpression

    // TODO Labeled statements
*/

const skipList = [
  AST_NODE_TYPES.ArrowFunctionExpression,
  AST_NODE_TYPES.FunctionDeclaration,
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.ClassDeclaration, // FIXME not so sure about this
  AST_NODE_TYPES.ClassExpression, // FIXME not so sure about this
];

export default function (ctx: NodeContext) {
  const probeSet = new Set<any>();
  const tree = deepClone()(ctx.node);
  // TODO thats a rather crude implementation, refactor
  const addProbe = (probe, originator, reason) =>
    probe &&
    probeSet.add({
      ...probe,
      metadata: {
        location: originator.loc.start,
        type: originator.type,
        reason,
      },
    });
  const probeSorter = (a, b) => (a.line - b.line) * 1000 + (a.column - b.column);

  Traverser.traverse(tree, {
    enter(node, parent) {
      try {
        if (parent && skipList.includes(node.type)) {
          this.skip();
          return;
        }
        switch (node.type) {
          // Add probes to "containing" blocks
          case AST_NODE_TYPES.Program:
            addProbe(getStartPosition(node), node, 'start');
            break;

          case AST_NODE_TYPES.ArrowFunctionExpression:
          case AST_NODE_TYPES.FunctionDeclaration:
          case AST_NODE_TYPES.FunctionExpression:
            /*
              Arrow function - concise body with a function expression
              Example
                const exp = (exponent) => (base) => base ^ exponent
                or
                const exp = (exponent) => function (base) { return base ^ exponent }
  
              In both cases "exp" function has a concise body
              
              Problem:
                even when function exp() is called, V8 marks it's body as not-covered because it's another function
                thus, exp() function considered not covered, unless the inner function is called
  
              Solution: 
                Place a probe at the beginning of a function signature
                (instead of placing a probe at the beginning of the body)
            */
            if (node.body.type === AST_NODE_TYPES.ArrowFunctionExpression) {
              addProbe(getStartPosition(node), node, 'start');
            } else {
              addProbe(getStartPosition(node.body), node, 'start');
            }
            break;

          // reference https://docs.google.com/document/d/1wCydi2HEZRF0skDeLb6CH0abZnTyVo5Vz5u-jhwi7es/edit#
          // Loops and iteration
          case AST_NODE_TYPES.ForStatement:
          case AST_NODE_TYPES.ForOfStatement:
          case AST_NODE_TYPES.ForInStatement:
          case AST_NODE_TYPES.WhileStatement:
          case AST_NODE_TYPES.DoWhileStatement:
            addProbe(getStartPosition(node.body), node, 'start');
            addProbe(getContinuationPosition(node, this.parents()), node, 'continuation');
            break;

          // Conditional control flow
          case AST_NODE_TYPES.SwitchCase:
            addProbe(getStartPosition(node), node, 'start');
            break;
          case AST_NODE_TYPES.SwitchStatement:
            addProbe(getContinuationPosition(node, this.parents()), node, 'continuation');
            break;

          case AST_NODE_TYPES.IfStatement:
            addProbe(getStartPosition(node.consequent), node, 'consequent');
            if (node.alternate) {
              addProbe(getStartPosition(node.alternate), node, 'alternate');
            }
            addProbe(getContinuationPosition(node, this.parents()), node, 'continuation');
            break;

          case AST_NODE_TYPES.ConditionalExpression: {
            // ternary expression - test ? consequent : alternate
            addProbe(getStartPosition(node.consequent), node, 'consequent'); // -1 on column index ?
            addProbe(getStartPosition(node.alternate), node, 'alternate'); // -1 on column index ?
            const continuationPosition = getContinuationPosition(node, this.parents());
            if (continuationPosition) addProbe(continuationPosition, node, 'continuation');
            break;
          }

          // Short-circuiting boolean operators
          case AST_NODE_TYPES.LogicalExpression: // && and ||
            addProbe(getStartPosition(node.right), node, 'start');
            // TODO add continuation probe?
            // addProbe(getContinuationPosition(node.right, parent));
            // addProbe(node.right.range[0]);
            // // continuation (might overlap with the next op but it's ok)
            // addProbe(node.right.range[1] + 1);
            break;

          // Generator function yields (Yield)
          // Unconditional control flow
          case AST_NODE_TYPES.YieldExpression:
          case AST_NODE_TYPES.ReturnStatement:
          case AST_NODE_TYPES.ThrowStatement:
          case AST_NODE_TYPES.ContinueStatement:
          case AST_NODE_TYPES.BreakStatement: // might result in erroneous placement in switch blocks
            addProbe(getContinuationPosition(node, this.parents()), node, 'continuation');
            break;

          // Exception control-flow
          case AST_NODE_TYPES.TryStatement: {
            const { block, handler: catchBlock, finalizer: finallyBlock } = node;
            addProbe(getStartPosition(catchBlock), node, 'start');
            if (finallyBlock) addProbe(getStartPosition(finallyBlock), node, 'start');
            break;
          }
          default:
            break;
        }
      } catch (e) {
        console.log(node.type);
        throw e;
      }
    },
  });
  return Array.from(probeSet).sort(probeSorter);
}

function getContinuationPosition(node: any, parentsForward: any[]) {
  const parents = parentsForward.slice().reverse();
  // find "capturing" parent block
  const blockNodeIndex = parents.findIndex(x => x.type === AST_NODE_TYPES.BlockStatement || x.type === AST_NODE_TYPES.Program);
  // ASSUMPTION: if node is not inside a block, there is no need to search for "continuation" position & place a probe
  if (blockNodeIndex === -1) return null;
  // throw new Error('node is not a descendant of Block or Program node');
  const blockNode = parents[blockNodeIndex];

  // define node's root among siblings
  const blockNodeIsDirectParent = blockNodeIndex === 0;
  const blockLevelContainer = blockNodeIsDirectParent ? node : parents[blockNodeIndex - 1];

  // find next sibling
  const nextSibling = getNextSibling(blockLevelContainer, blockNode);

  if (nextSibling) {
    return getStartPosition(nextSibling);
  }
  return null;
}

function getNextSibling(container, parent) {
  if (parent.body.length === 1) return null;
  const containerIndex = parent.body.findIndex(x => x === container);
  const isLastInParentBlock = containerIndex === parent.body.length - 1;
  if (isLastInParentBlock) return null;
  return parent.body[containerIndex + 1];
}

function getStartPosition(node) {
  return node.loc.start;
}

function getEndPosition(node) {
  return node.loc.end;
}

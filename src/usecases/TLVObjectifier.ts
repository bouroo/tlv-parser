import type { TLVNode } from "../domain/TLVNode.js";
import type { TLVObject } from "../domain/TLVObject.js";

export class TLVObjectifier {
  objectify(nodes: TLVNode[]): TLVObject {
    const result: TLVObject = {};
    for (const node of nodes) {
      if (node.hasChildren()) {
        result[node.tag] = this.objectify(node.children);
      } else {
        result[node.tag] = node.data;
      }
    }
    return result;
  }
}

import type { TLVNode } from "../domain/TLVNode.js";
import type { TLVObject } from "../domain/TLVObject.js";

/**
 * Converts an array of TLVNode into a nested plain object keyed by tag.
 */
export class TLVObjectifier {
  /**
   * Objectify TLV nodes into a nested object keyed by tag.
   *
   * @param nodes - Array of TLV nodes.
   * @returns Nested object keyed by tag.
   */
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

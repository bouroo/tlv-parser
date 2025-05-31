/**
 * Converts an array of TLVNode into a nested plain object keyed by tag.
 *
 * @param {import("../domain/TLVNode.js").TLVNode[]} nodes - List of TLV nodes to objectify.
 * @returns {Record<string, any>} Nested object representation of the TLV nodes.

 */
export class TLVObjectifier {
  /**
   * Perform objectification of TLV nodes into nested object.
   *
   * @param {import("../domain/TLVNode.js").TLVNode[]} nodes - Array of TLV nodes.
   * @returns {Record<string, any>} Nested object keyed by tag.
   */
  objectify(nodes) {
    const result = {};
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

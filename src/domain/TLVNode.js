/**
 * Represents a TLV node with tag, length, data, and optional child nodes.
 */
export class TLVNode {
  /**
   * Creates a new TLVNode.
   * @param {string} tag - Two-digit tag of the node.
   * @param {number} length - Length of the node's data.
   * @param {string} [data=""] - The raw data string if leaf.
   * @param {TLVNode[]} [children=[]] - Array of child TLV nodes.
   */
  constructor(tag, length, data = "", children = []) {
    this.tag = tag;
    this.length = length;
    this.data = data;
    this.children = children;
  }
  /**
   * Checks if this node has any child nodes.
   * @returns {boolean} True if this node has one or more children.
   */
  hasChildren() {
    return this.children.length > 0;
  }
}

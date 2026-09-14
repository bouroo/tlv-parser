/**
 * Represents a TLV node with tag, length, data, and optional child nodes.
 */
export class TLVNode {
  tag: string;
  length: number;
  data: string;
  children: TLVNode[];

  /**
   * Creates a new TLVNode.
   *
   * @param tag - Two-digit tag of the node.
   * @param length - Length of the node's data.
   * @param data - The raw data string if leaf.
   * @param children - Array of child TLV nodes.
   */
  constructor(tag: string, length: number, data = "", children: TLVNode[] = []) {
    this.tag = tag;
    this.length = length;
    this.data = data;
    this.children = children;
  }

  /**
   * Checks if this node has any child nodes.
   *
   * @returns True if this node has one or more children.
   */
  hasChildren(): boolean {
    return this.children.length > 0;
  }
}

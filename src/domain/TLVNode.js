export class TLVNode {
  constructor(tag, length, data = "", children = []) {
    this.tag = tag;
    this.length = length;
    this.data = data;
    this.children = children;
  }
  hasChildren() {
    return this.children.length > 0;
  }
}

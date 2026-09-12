export class TLVNode {
  tag: string;
  length: number;
  data: string;
  children: TLVNode[];

  constructor(tag: string, length: number, data = "", children: TLVNode[] = []) {
    this.tag = tag;
    this.length = length;
    this.data = data;
    this.children = children;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }
}

export class TLVObjectifier {
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

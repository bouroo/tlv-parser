import { IParser } from "../interfaces/IParser.js";
import { TLVParser } from "../usecases/TLVParser.js";
import { TLVObjectifier } from "../usecases/TLVObjectifier.js";

export class TLVParserAdapter extends IParser {
  /**
   * @param {{ maxDepth?: number }} [options]
   */
  constructor(options) {
    super();
    this.parser = new TLVParser(options);
    this.objectifier = new TLVObjectifier();
  }

  /**
   * @param {string} tlvString
   * @returns {import('../domain/TLVNode.js').TLVNode[]}
   */
  parseNodes(tlvString) {
    if (typeof tlvString !== "string") {
      throw new TypeError("parseNodes expects a string");
    }
    return this.parser.parse(tlvString);
  }

  /**
   * @param {string} tlvString
   * @returns {Record<string, any>}
   */
  parseObject(tlvString) {
    const nodes = this.parseNodes(tlvString);
    return this.objectifier.objectify(nodes);
  }

  /**
   * Default parse → object
   */
  parse(tlvString) {
    return this.parseObject(tlvString);
  }
}

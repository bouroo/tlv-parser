/**
 * Adapter implementing IParser to parse TLV strings into nodes or objects.
 *

 */
import { IParser } from "../interfaces/IParser.js";
import { TLVParser } from "../usecases/TLVParser.js";
import { TLVObjectifier } from "../usecases/TLVObjectifier.js";

export class TLVParserAdapter extends IParser {
  /**
   * Initialize the TLVParserAdapter.
   *
   * @param {{ maxDepth?: number }} [options] - Optional parser settings.
   */
  constructor(options) {
    super();
    this.parser = new TLVParser(options);
    this.objectifier = new TLVObjectifier();
  }

  /**
   * Parse a TLV string into raw TLVNode instances.
   *
   * @param {string} tlvString - TLV encoded string.
   * @returns {import('../domain/TLVNode.js').TLVNode[]} Array of parsed TLV nodes.
   * @throws {TypeError} When input is not a string.
   */
  parseNodes(tlvString) {
    if (typeof tlvString !== "string") {
      throw new TypeError("parseNodes expects a string");
    }
    return this.parser.parse(tlvString);
  }

  /**
   * Parse a TLV string into a nested plain object keyed by tag.
   *
   * @param {string} tlvString - TLV encoded string.
   * @returns {Record<string, any>} Nested object representation.
   */
  parseObject(tlvString) {
    const nodes = this.parseNodes(tlvString);
    return this.objectifier.objectify(nodes);
  }

  /**
   * Default parse method returning nested object form.
   *
   * @param {string} tlvString - TLV encoded string.
   * @returns {Record<string, any>} Parsed object.
   */
  parse(tlvString) {
    return this.parseObject(tlvString);
  }
}

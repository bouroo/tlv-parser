import type { TLVNode } from "../domain/TLVNode.js";
import type { TLVObject } from "../domain/TLVObject.js";
import { IParser } from "../interfaces/IParser.js";
import { TLVParser, type TLVParserOptions } from "../usecases/TLVParser.js";
import { TLVObjectifier } from "../usecases/TLVObjectifier.js";

/**
 * Adapter implementing IParser to parse TLV strings into nodes or objects.
 */
export class TLVParserAdapter extends IParser {
  private readonly parser: TLVParser;
  private readonly objectifier: TLVObjectifier;

  /**
   * Initialize the TLVParserAdapter.
   *
   * @param options - Optional parser settings.
   */
  constructor(options?: TLVParserOptions) {
    super();
    this.parser = new TLVParser(options);
    this.objectifier = new TLVObjectifier();
  }

  /**
   * Parse a TLV string into raw TLVNode instances.
   *
   * @param tlvString - TLV encoded string.
   * @returns Array of parsed TLV nodes.
   * @throws {TypeError} When input is not a string.
   */
  parseNodes(tlvString: string): TLVNode[] {
    if (typeof tlvString !== "string") {
      throw new TypeError("parseNodes expects a string");
    }
    return this.parser.parse(tlvString);
  }

  /**
   * Parse a TLV string into a nested plain object keyed by tag.
   *
   * @param tlvString - TLV encoded string.
   * @returns Nested object representation.
   */
  parseObject(tlvString: string): TLVObject {
    const nodes = this.parseNodes(tlvString);
    return this.objectifier.objectify(nodes);
  }

  /**
   * Default parse method returning nested object form.
   */
  override parse(tlvString: string): TLVObject {
    return this.parseObject(tlvString);
  }
}

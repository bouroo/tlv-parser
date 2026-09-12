import type { TLVNode } from "../domain/TLVNode.js";
import type { TLVObject } from "../domain/TLVObject.js";
import { IParser } from "../interfaces/IParser.js";
import { TLVParser, type TLVParserOptions } from "../usecases/TLVParser.js";
import { TLVObjectifier } from "../usecases/TLVObjectifier.js";

export class TLVParserAdapter extends IParser {
  private readonly parser: TLVParser;
  private readonly objectifier: TLVObjectifier;

  constructor(options?: TLVParserOptions) {
    super();
    this.parser = new TLVParser(options);
    this.objectifier = new TLVObjectifier();
  }

  parseNodes(tlvString: string): TLVNode[] {
    if (typeof tlvString !== "string") {
      throw new TypeError("parseNodes expects a string");
    }
    return this.parser.parse(tlvString);
  }

  parseObject(tlvString: string): TLVObject {
    const nodes = this.parseNodes(tlvString);
    return this.objectifier.objectify(nodes);
  }

  /**
   * Default parse → object.
   */
  override parse(tlvString: string): TLVObject {
    return this.parseObject(tlvString);
  }
}

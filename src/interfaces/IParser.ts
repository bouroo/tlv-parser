import type { TLVObject } from "../domain/TLVObject.js";

/**
 * Parser contract. Implementations override `parse`; the base throws so an
 * unimplemented parser fails loudly instead of returning undefined.
 */
export class IParser {
  parse(_tlvString: string): TLVObject {
    throw new Error("IParser.parse() must be implemented");
  }
}

/**
 * Base interface for parsers.
 *

 */
export class IParser {
  /**
   * Abstract parse method to be implemented by subclasses.
   *
   * @param {string} tlvString - TLV encoded string.
   * @param {object} [options] - Optional parse options.
   * @returns {*} Parsed result, implementation specific.
   */
  parse(/* tlvString, options */) {
    throw new Error("IParser.parse() must be implemented");
  }
}

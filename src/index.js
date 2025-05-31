/**
 * Public API for TLV parser.
 * @module
 * @author Kawin Viriyaprasopsook <kawin.v@kkumail.com>
 */
import { TLVParserAdapter } from "./adapters/TLVParserAdapter.js";

const adapter = new TLVParserAdapter();

/**
 * Parse TLV string → nested JS object keyed by tag.
 *
 * @param {string} tlv - TLV encoded string.
 * @returns {Record<string, any>} Nested object keyed by tag.
 * @throws {TypeError} When input is not a string.
 */
export function parseTLV(tlv) {
  return adapter.parseObject(tlv);
}

/**
 * Parse TLV string → raw TLVNode[].
 *
 * @param {string} tlv - TLV encoded string.
 * @returns {import('./domain/TLVNode.js').TLVNode[]} Array of TLV nodes.
 * @throws {TypeError} When input is not a string.
 */
export function parseTLVNodes(tlv) {
  return adapter.parseNodes(tlv);
}

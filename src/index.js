import { TLVParserAdapter } from "./adapters/TLVParserAdapter.js";

const adapter = new TLVParserAdapter();

/**
 * Parse TLV string → nested JS object keyed by tag
 * @param {string} tlv
 * @returns {Record<string, any>}
 */
export function parseTLV(tlv) {
  return adapter.parseObject(tlv);
}

/**
 * Parse TLV string → raw TLVNode[]
 * @param {string} tlv
 * @returns {import('./domain/TLVNode.js').TLVNode[]}
 */
export function parseTLVNodes(tlv) {
  return adapter.parseNodes(tlv);
}

import { TLVParserAdapter } from "./adapters/TLVParserAdapter.js";
import type { TLVNode } from "./domain/TLVNode.js";
import type { TLVObject } from "./domain/TLVObject.js";

const adapter = new TLVParserAdapter();

/**
 * Parse a TLV string into a nested object keyed by tag.
 */
export function parseTLV(tlv: string): TLVObject {
  return adapter.parseObject(tlv);
}

/**
 * Parse a TLV string into raw TLVNode records.
 */
export function parseTLVNodes(tlv: string): TLVNode[] {
  return adapter.parseNodes(tlv);
}

// TLVNode is exported because it is the element type of parseTLVNodes' result;
// with package "exports" limited to ".", a consumer has no other way to reach it.
export { TLVNode } from "./domain/TLVNode.js";
export type { TLVObject } from "./domain/TLVObject.js";

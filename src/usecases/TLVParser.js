// src/usecases/TLVParser.js

import { TLVNode } from "../domain/TLVNode.js";

/**
 * Parses TLV-encoded strings into an array of TLVNode.
 *

 */
export class TLVParser {
  /**
   * Creates a new TLVParser.
   *
   * @param {{ maxDepth?: number }} options - Optional settings, including maximum nesting depth.

   */
  constructor(options = {}) {
    this.maxDepth = options.maxDepth ?? 20;
  }

  /**
   * Parse a TLV‐encoded string into an array of TLVNode.
   * @param {string} tlvString
   * @returns {TLVNode[]}
   */
  parse(tlvString) {
    if (typeof tlvString !== "string") {
      throw new TypeError("TLVParser.parse: input must be a string");
    }
    return this._parseRange(tlvString, 0, tlvString.length, 0);
  }

  /**
   * Internal recursive parser over str[offset..end)
   * @param {string} str
   * @param {number} offset
   * @param {number} end
   * @param {number} depth
   * @returns {TLVNode[]}
   */
  _parseRange(str, offset, end, depth) {
    if (depth > this.maxDepth) {
      throw new Error("TLVParser: maximum nesting depth exceeded");
    }

    const nodes = [];
    let i = offset;

    // As long as we have at least a tag(2)+len(2)
    while (i + 4 <= end) {
      // 1) Tag
      const tag = str.charAt(i) + str.charAt(i + 1);

      // 2) Two‐digit length
      const c2 = str.charCodeAt(i + 2),
        c3 = str.charCodeAt(i + 3);
      if (c2 < 48 || c2 > 57 || c3 < 48 || c3 > 57) {
        throw new Error(`TLVParser: invalid length digits at pos ${i + 2}`);
      }
      const length = (c2 - 48) * 10 + (c3 - 48);

      const valueStart = i + 4;
      const valueEnd = valueStart + length;
      if (valueEnd > end) {
        throw new Error(
          `TLVParser: length ${length} at pos ${i} exceeds available data`,
        );
      }

      let node;

      // 3) Try recursive parse if there's room for a child header
      if (length >= 4) {
        try {
          const children = this._parseRange(
            str,
            valueStart,
            valueEnd,
            depth + 1,
          );
          // verify children exactly fill this value‐segment
          let sum = 0;
          for (const c of children) sum += 4 + c.length;
          if (children.length > 0 && sum === length) {
            node = new TLVNode(tag, length, "", children);
          }
        } catch {
          // any error in nested parse → treat as leaf
        }
      }

      // 4) Fallback to leaf
      if (!node) {
        const data = str.slice(valueStart, valueEnd);
        node = new TLVNode(tag, length, data, []);
      }

      nodes.push(node);
      i = valueEnd;
    }

    // If we're at top‐level, enforce no leftover bytes
    if (depth === 0 && i !== end) {
      throw new Error(`TLVParser: leftover bytes in range [${i},${end})`);
    }

    // Nested calls swallow any trailing bytes (fallback → leaf)
    return nodes;
  }
}

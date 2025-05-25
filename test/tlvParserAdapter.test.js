import test from "node:test";
import assert from "node:assert/strict";
import { parseTLV, parseTLVNodes } from "../src/index.js";
import { TLVNode } from "../src/domain/TLVNode.js";

const sample =
  "0046000600000101030140225202505252KGPGoQxQH5Z5RySO5102TH9104904A";

test("parseTLVNodes() – non‐string → TypeError", () => {
  assert.throws(() => parseTLVNodes(123), {
    name: "TypeError",
  });
});

test("parseTLVNodes() – correct TLVNode[]", () => {
  const nodes = parseTLVNodes(sample);
  assert.ok(Array.isArray(nodes));
  assert.equal(nodes.length, 3);

  // root00
  const r0 = nodes[0];
  assert.ok(r0 instanceof TLVNode);
  assert.equal(r0.tag, "00");
  assert.equal(r0.length, 46);
  assert.equal(r0.children.length, 3);

  // 51 & 91
  assert.equal(nodes[1].tag, "51");
  assert.equal(nodes[1].data, "TH");
  assert.equal(nodes[2].tag, "91");
  assert.equal(nodes[2].data, "904A");
});

test("parseTLV() – nested object", () => {
  const obj = parseTLV(sample);
  assert.deepEqual(obj, {
    "00": {
      "00": "000001",
      "01": "014",
      "02": "202505252KGPGoQxQH5Z5RySO",
    },
    51: "TH",
    91: "904A",
  });
});

test("parseTLV() – non‐string → TypeError", () => {
  assert.throws(() => parseTLV({}), {
    name: "TypeError",
  });
});

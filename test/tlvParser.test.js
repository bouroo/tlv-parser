import test from "node:test";
import assert from "node:assert/strict";
import { TLVParser } from "../src/usecases/TLVParser.js";
import { TLVNode } from "../src/domain/TLVNode.js";

test("parse() – empty string → []", () => {
  const p = new TLVParser();
  const nodes = p.parse("");
  assert.deepEqual(nodes, []);
});

test("parse() – non‐string → TypeError", () => {
  const p = new TLVParser();
  assert.throws(() => p.parse(null), {
    name: "TypeError",
    message: /input must be a string/,
  });
});

test("parse() – simple TLV", () => {
  const p = new TLVParser();
  const nodes = p.parse("0102AB");
  assert.equal(nodes.length, 1);

  const n = nodes[0];
  assert.ok(n instanceof TLVNode);
  assert.equal(n.tag, "01");
  assert.equal(n.length, 2);
  assert.equal(n.data, "AB");
  assert.deepEqual(n.children, []);
});

test("parse() – nested TLV", () => {
  const p = new TLVParser();
  // 00 length=6 contains 01 length=02 'CD'
  const input = "00060102CD";
  const nodes = p.parse(input);
  assert.equal(nodes.length, 1);

  const root = nodes[0];
  assert.equal(root.tag, "00");
  assert.equal(root.length, 6);
  assert.equal(root.data, "");
  assert.equal(root.children.length, 1);

  const child = root.children[0];
  assert.equal(child.tag, "01");
  assert.equal(child.length, 2);
  assert.equal(child.data, "CD");
});

test("parse() – fallback leaf when nested parse does not exactly consume", () => {
  const p = new TLVParser();
  // length=5, data='ABCDZ' → nested parse will fail on invalid digit 'Z' → fallback to leaf
  const nodes = p.parse("0105ABCDZ");
  assert.equal(nodes.length, 1);
  const n = nodes[0];
  assert.equal(n.tag, "01");
  assert.equal(n.length, 5);
  assert.equal(n.data, "ABCDZ");
  assert.deepEqual(n.children, []);
});

test("parse() – leftover bytes at top level throws", () => {
  const p = new TLVParser();
  assert.throws(() => p.parse("0102ABXX"), {
    message: /leftover bytes in range/,
  });
});

test("parse() – invalid length digits throws", () => {
  const p = new TLVParser();
  assert.throws(() => p.parse("01A2AB"), {
    message: /invalid length digits/,
  });
});

test("parse() – length exceeds data throws", () => {
  const p = new TLVParser();
  assert.throws(() => p.parse("0105ABC"), {
    message: /exceeds available data/,
  });
});

test("parse() – nesting beyond maxDepth falls back to leaf", () => {
  // maxDepth=0 so any attempt to parse children at depth=1 is blocked
  const p = new TLVParser({ maxDepth: 0 });
  const nodes = p.parse("0004ABCD");
  assert.equal(nodes.length, 1);
  const n = nodes[0];
  assert.ok(n instanceof TLVNode);
  assert.equal(n.tag, "00");
  assert.equal(n.length, 4);
  assert.equal(n.data, "ABCD");
  assert.deepEqual(n.children, []);
});

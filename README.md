# tlv-parser

[![npm version](https://img.shields.io/npm/v/tlv-parser.svg)](https://www.npmjs.com/package/tlv-parser)
[![downloads](https://img.shields.io/npm/dm/tlv-parser.svg)](https://www.npmjs.com/package/tlv-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Test](https://github.com/bouroo/tlv-parser/actions/workflows/test.yml/badge.svg)](https://github.com/bouroo/tlv-parser/actions/workflows/test.yml)

Zero-dependency, recursive [TLV](https://en.wikipedia.org/wiki/Type%E2%80%93length%E2%80%93value) (Tag-Length-Value) parser, written in TypeScript and compiled to pure ES modules with type declarations included. Returns either raw `TLVNode` objects or a nested plain object keyed by tag.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Nested object form](#nested-object-form)
  - [Raw node form](#raw-node-form)
  - [Error handling](#error-handling)
- [API](#api)
- [Behaviour notes](#behaviour-notes)
- [Project structure](#project-structure)
- [Development](#development)
- [Continuous integration](#continuous-integration)
- [Releasing](#releasing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Recursive** — nested TLVs are detected and parsed into a tree, not left as opaque strings.
- **Two output shapes** — a nested object keyed by tag, or the raw `TLVNode[]` tree.
- **Typed** — written in TypeScript; the published package ships `.d.ts` declarations alongside the compiled modules.
- **Zero runtime dependencies** — nothing to install, nothing to audit. CI asserts it.
- **Fails loudly on malformed top-level input** — a truncated value, a non-numeric length or leftover trailing bytes throws instead of returning a silently-wrong result.

## Requirements

- **Node.js** with ES module support. The package declares no `engines` floor; CI runs the test suite on the current Active LTS (`lts/*`).
- **Bun** to build from source (transpiling `src/*.ts`). Consumers installing from npm need neither Bun nor a build step — the published tarball is already compiled.

## Installation

```bash
npm install tlv-parser
# or
yarn add tlv-parser
# or
bun add tlv-parser
```

## Usage

```js
import { parseTLV, parseTLVNodes } from "tlv-parser";

const tlv = "0046000600000101030140225202505252KGPGoQxQH5Z5RySO5102TH9104904A";

// 1) Nested object keyed by tag
console.log(parseTLV(tlv));

// 2) Raw TLVNode[] tree
console.log(parseTLVNodes(tlv));
```

### Nested object form

`parseTLV` collapses the tree into plain objects. A node with children becomes a nested object; a leaf becomes its raw data string.

```js
import { parseTLV } from "tlv-parser";

parseTLV("0046000600000101030140225202505252KGPGoQxQH5Z5RySO5102TH9104904A");
/* =>
{
  "51": "TH",
  "91": "904A",
  "00": {
    "00": "000001",
    "01": "014",
    "02": "202505252KGPGoQxQH5Z5RySO"
  }
}
*/
```

The keys are printed in that order because JavaScript enumerates integer-like keys (`"51"`, `"91"`) before other string keys (`"00"`) — see [Behaviour notes](#behaviour-notes).

### Raw node form

`parseTLVNodes` returns the tree untransformed, which preserves the original order and keeps each node's parsed `length`.

```js
import { parseTLVNodes } from "tlv-parser";

parseTLVNodes("0046000600000101030140225202505252KGPGoQxQH5Z5RySO5102TH9104904A");
/* =>
[
  TLVNode { tag: '00', length: 46, data: '', children: [ [TLVNode], [TLVNode], [TLVNode] ] },
  TLVNode { tag: '51', length: 2, data: 'TH', children: [] },
  TLVNode { tag: '91', length: 4, data: '904A', children: [] }
]
*/
```

### Error handling

Malformed input throws — it is never returned as a partial result. Catch it and decide what a bad payload means in your context.

```js
import { parseTLV } from "tlv-parser";

try {
  parseTLV(payload);
} catch (error) {
  console.error("Invalid TLV payload:", error.message);
}
```

## API

### `parseTLV(tlvString: string): TLVObject`

Parses a TLV-encoded string into a nested plain object keyed by tag. Values are either strings (leaf data) or nested objects (sub-TLVs).

- Throws `TypeError` when `tlvString` is not a string.

### `parseTLVNodes(tlvString: string): TLVNode[]`

Parses a TLV-encoded string into an array of `TLVNode` instances, preserving document order.

- Throws `TypeError` when `tlvString` is not a string.

### `TLVNode`

| Property | Type | Description |
| --- | --- | --- |
| `tag` | `string` | The two-digit tag. |
| `length` | `number` | The parsed length of the value field. |
| `data` | `string` | The raw value when the node is a leaf; `""` when it has children. |
| `children` | `TLVNode[]` | Child nodes; empty for a leaf. |

| Method | Returns | Description |
| --- | --- | --- |
| `hasChildren()` | `boolean` | `true` when `children` is non-empty. |

Both `TLVNode` and the `TLVObject` type are exported from the package root, so `instanceof` checks and return-type annotations work without reaching into internal paths.

## Behaviour notes

- **A node becomes a container only if its children exactly consume its value field.** If the nested bytes do not add up to the declared length, the node is returned as a leaf holding the raw string instead. A node whose value is shorter than 4 characters can never contain a child header and is always a leaf.
- **Nesting is capped at 20 levels.** Beyond that the parser stops descending and returns the node as a leaf rather than throwing.
- **Object key order is not document order.** `parseTLV` builds a plain object, so JavaScript's key ordering applies: integer-like tags (`"51"`) enumerate in ascending numeric order, ahead of other string tags (`"00"`). Use `parseTLVNodes` when order matters.
- **Duplicate tags collide.** The object form is keyed by tag, so a repeated tag overwrites the earlier value — `parseTLV("0102AB0102CD")` returns `{ "01": "CD" }`. Use `parseTLVNodes` to see every occurrence.
- **Malformed top-level input throws.** The messages are:

  | Input | Error |
  | --- | --- |
  | Not a string | `TypeError: parseNodes expects a string` |
  | Length field is not two digits, e.g. `"01A2AB"` | `TLVParser: invalid length digits at pos 2` |
  | Declared length runs past the data, e.g. `"0105ABC"` | `TLVParser: length 5 at pos 0 exceeds available data` |
  | Bytes left over after a complete parse, e.g. `"0102ABXX"` | `TLVParser: leftover bytes in range [6,8)` |

  Trailing bytes are only rejected at the top level; inside a nested value they cause that node to fall back to a leaf.

## Project structure

The parser is split into layers. `src/` is TypeScript and is **not** published; `dist/` holds the compiled ES modules plus their `.d.ts` declarations and is the only thing that ships.

```
src/
  index.ts                           public API: parseTLV, parseTLVNodes
  domain/TLVNode.ts                  the TLVNode entity
  domain/TLVObject.ts                the recursive result type (types only)
  usecases/TLVParser.ts              recursive tag/length/value parser
  usecases/TLVObjectifier.ts         TLVNode[] -> nested object
  interfaces/IParser.ts              parser contract
  adapters/TLVParserAdapter.ts       wires the parser and objectifier together
test/
  usecases/TLVParser.test.js         parser unit tests
  adapters/TLVParserAdapter.test.js  public API tests, through dist/index.js
example/index.js                     runnable example
```

`test/` mirrors the `src/` layers, so a module's tests sit under the same layer folder as the module itself. The tests import from `dist/`, so they exercise the artifact consumers actually receive rather than the sources — a broken build cannot pass the suite.

The example imports the package by its own name (`"tlv-parser"`), which Node resolves through the `exports` field in `package.json`. It therefore runs against `dist/` too, and needs `npm run build` first.

## Development

```bash
npm install
npm run build       # bun transpiles src/*.ts -> dist/*.js; tsc emits dist/*.d.ts
npm test            # builds, then runs `node --test` against dist/
node example/index.js
```

`npm run build` runs two steps: `bun build --no-bundle` transpiles each source module to `dist/` preserving the layer tree, and `tsc` emits the `.d.ts` declarations. A single bundled file would hide the layer structure and drop the declarations, so the package ships per-module output.

## Continuous integration

`.github/workflows/test.yml` runs on every push to `main` and every pull request, on the current Active LTS (`lts/*`):

- install dependencies with `npm ci`
- type-check and build (`npm run build`) — `tsc` type-checks the whole program, so a type error fails here rather than reaching a consumer
- run the suite with `node --test` against the built output
- assert the **zero-dependency** claim, so it cannot quietly rot
- assert the **published file set** — only `dist/` plus `package.json`, `README.md` and `LICENSE` may reach a consumer
- assert every **entry point resolves** to a file that actually shipped, since a wrong path there is invisible until install

## Releasing

Publishing is driven by GitHub Releases using npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so no npm token is stored in this repository.

The trusted publisher grants **stage-publish only**, so the workflow uploads into npm's staging area rather than publishing directly. Staged publishing defers the proof-of-presence (2FA) check to the approval step, which is what lets CI run without a maintainer present. A human finishes it:

```bash
npm stage list            # find the stage id
npm stage approve <id>    # publishes it (2FA required)
npm stage reject <id>     # discards it
```

Cutting a release:

```bash
npm version 1.0.3         # set the version and create the matching tag
git push --follow-tags
gh release create v1.0.3 --generate-notes
```

The workflow re-checks that the tag matches `package.json` and that the version is not already on npm, so a mismatch fails before anything reaches the registry.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add …"`.
4. Push to the branch: `git push origin feat/your-feature`.
5. Open a pull request.

Please add tests for any behaviour change and make sure `npm test` passes.

## License

MIT © [Kawin Viriyaprasopsook](https://github.com/bouroo)

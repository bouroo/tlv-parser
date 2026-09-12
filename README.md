# tlv-parser

[![npm version](https://img.shields.io/npm/v/tlv-parser.svg)](https://www.npmjs.com/package/tlv-parser)
[![downloads](https://img.shields.io/npm/dm/tlv-parser.svg)](https://www.npmjs.com/package/tlv-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Build Status](https://github.com/bouroo/tlv-parser/actions/workflows/test.yml/badge.svg)](https://github.com/bouroo/tlv-parser/actions)

Zero-dependency, recursive TLV (Tag-Length-Value) parser. Written in TypeScript and
compiled to pure ES Modules, with type declarations included.
Supports both a raw array of `TLVNode` objects and a nested plain-object keyed by tag.

---

## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [parseTLV (object)](#parsetlv-object)
  - [parseTLVNodes (raw nodes)](#parsetlvnodes-raw-nodes)
- [API](#api)
- [Project Structure](#project-structure)
- [Development](#development)
- [Releasing](#releasing)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
# via npm
npm install tlv-parser

# or yarn
yarn add tlv-parser
```

---

## Usage

```js
import { parseTLV, parseTLVNodes } from 'tlv-parser';

// Sample TLV string
const tlv = '0046000600000101030140225202505252KGPGoQxQH5Z5RySO5102TH9104904A';

// 1) Get nested object keyed by tag
const obj = parseTLV(tlv);
console.log(obj);
/* {
  "00": {
    "00": "000001",
    "01": "014",
    "02": "202505252KGPGoQxQH5Z5RySO"
  },
  "51": "TH",
  "91": "904A"
} */

// 2) Get raw TLVNode[]
const nodes = parseTLVNodes(tlv);
console.log(nodes);
/* [
  TLVNode { tag: '00', length: 46, data: '', children: [ … ] },
  TLVNode { tag: '51', length: 2, data: 'TH', children: [] },
  TLVNode { tag: '91', length: 4, data: '904A', children: [] }
] */
```

---

## API

### parseTLV(tlvString: string): TLVObject

Parses a TLV-encoded string into a nested plain object keyed by tag.
Values are either strings (leaf data) or nested objects (sub-TLVs).

### parseTLVNodes(tlvString: string): TLVNode[]

Parses a TLV-encoded string into an array of `TLVNode` entities.
Each `TLVNode` has:
- `tag`: string (2-digit tag)
- `length`: number (parsed length)
- `data`: string (raw data if no children)
- `children`: `TLVNode[]` (empty if leaf)

Both `TLVNode` and the `TLVObject` type are exported from the package root, so
`instanceof` checks and return-type annotations work without reaching into
internal paths.

---

## Project Structure

```
src/
  domain/       TLVNode entity and the TLVObject result type
  usecases/     TLVParser (recursive parse), TLVObjectifier (nodes → object)
  interfaces/   IParser contract
  adapters/     TLVParserAdapter, wiring the usecases together
test/           node:test suites, exercising the built output
```

`src/` is TypeScript and is **not** published. `dist/` holds the compiled ES modules
plus their `.d.ts` declarations, and is the only thing that ships.

---

## Development

Requires [Bun](https://bun.sh) to transpile and Node to run the tests.

```bash
npm install
npm run build      # bun transpiles src/*.ts → dist/*.js; tsc emits dist/*.d.ts
npm test           # builds, then runs `node --test` against dist/
```

The tests import from `dist/`, so they exercise the artifact consumers actually
receive rather than the sources — a broken build cannot pass the suite.

---

## Releasing

Publishing is driven by GitHub Releases using npm
[trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so no npm
token is stored in this repository.

The trusted publisher grants **stage-publish only**, so the workflow uploads into
npm's staging area rather than publishing directly. Staged publishing defers the
proof-of-presence (2FA) check to the approval step, which is what allows CI to run
without a maintainer present. A human finishes it:

```bash
npm stage list            # find the stage id
npm stage approve <id>    # publishes it (2FA required)
npm stage reject <id>     # discards it
```

Then cut the release as usual:

```bash
npm version patch
git push --follow-tags
gh release create v1.0.3 --generate-notes
```

---

## Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feat/YourFeature`)
3. Commit your changes (`git commit -m "feat: add …"`)
4. Push to your branch (`git push origin feat/YourFeature`)
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) and write tests.

---

## License

MIT © [Kawin Viriyaprasopsook](https://github.com/bouroo)

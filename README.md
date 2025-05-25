# tlv-parser

[![npm version](https://img.shields.io/npm/v/tlv-parser.svg)](https://www.npmjs.com/package/tlv-parser)
[![downloads](https://img.shields.io/npm/dm/tlv-parser.svg)](https://www.npmjs.com/package/tlv-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Build Status](https://github.com/bouroo/tlv-parser/actions/workflows/test.yml/badge.svg)](https://github.com/bouroo/tlv-parser/actions)

Zero-dependency, recursive TLV (Tag-Length-Value) parser in pure ES Modules.
Supports both a raw array of `TLVNode` objects and a nested plain-object keyed by tag.

---

## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [parseTLV (object)](#parsetlv-object)
  - [parseTLVNodes (raw nodes)](#parsetlvnodes-raw-nodes)
- [API](#api)
- [Project Structure](#project-structure)
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

### parseTLV(tlvString: string): Record<string, any>

Parses a TLV-encoded string into a nested plain object keyed by tag.
Values are either strings (leaf data) or nested objects (sub-TLVs).

### parseTLVNodes(tlvString: string): TLVNode[]

Parses a TLV-encoded string into an array of `TLVNode` entities.
Each `TLVNode` has:
- `tag`: string (2-digit tag)
- `length`: number (parsed length)
- `data`: string (raw data if no children)
- `children`: `TLVNode[]` (empty if leaf)

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

import { parseTLV, parseTLVNodes } from "tlv-parser";

// Sample TLV string
const input =
  "0046000600000101030140225202505252KGPGoQxQH5Z5RySO5102TH9104904A";

// 1) get nested object
const obj = parseTLV(input);
console.log(obj);
/*
{
  "00": { "00": "000001", "01": "014", "02": "202505252KGPGoQxQH5Z5RySO" },
  "51": "TH",
  "91": "904A"
}
*/

// 2) get raw TLVNode[]
const nodes = parseTLVNodes(input);
console.log(nodes);
/*
[
  TLVNode { tag: '00', length: 46, data: '', children: [ … ] },
  TLVNode { tag: '51', length: 2, data: 'TH', children: [] },
  TLVNode { tag: '91', length: 4, data: '904A', children: [] }
]
*/

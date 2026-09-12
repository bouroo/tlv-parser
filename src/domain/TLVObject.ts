/**
 * The objectified form of a parsed TLV string: leaf values keyed by tag, where a
 * grouping tag maps to a nested TLVObject. Recursive, because a group's value is
 * itself a collection of tagged values.
 *
 * This module is types-only, so it needs no runtime counterpart in the build.
 */
export type TLVObject = { [tag: string]: string | TLVObject };

import type { BasicTypes } from "~/domains/userData";

// A node in a person tree (kinder or elternteile descendants): flat fields plus an
// optional nested `kinder` array. Shared by both summary components and the tree helpers.
export type KindItem = Record<string, BasicTypes> & {
  kinder?: KindItem[];
};

// An item paired with its full ancestor index path from the root (including own index).
export type ItemWithPath = {
  item: KindItem;
  indexes: number[];
};

// An item paired with its index path and its direct parent's display name.
export type DescendantEntry = ItemWithPath & {
  directParentName: string;
};

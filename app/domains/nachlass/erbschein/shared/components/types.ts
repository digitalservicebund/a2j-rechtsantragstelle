import {
  type Kind,
  type BaseElternteilKind,
  type BaseKind,
  type ElternteilKind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

// A node in a person tree (kinder or elternteile descendants): flat fields plus an
// optional nested `kinder` array. Shared by both summary components and the tree helpers.
export type PersonItem = BaseElternteilKind | BaseKind | Kind | ElternteilKind;

// An item paired with its full ancestor index path from the root (including own index).
export type ItemWithPath = {
  item: PersonItem;
  indexes: number[];
};

// An item paired with its index path, direct parent's display name, and implied relationship
// to the Erblasser.
export type DescendantEntry = ItemWithPath & {
  directParentName: string;
  relationshipToErblasser: string;
};

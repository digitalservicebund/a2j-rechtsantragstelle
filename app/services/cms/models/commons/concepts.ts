export type RelationOneToOne<T> = {
  data?: { id: number; attributes: T };
};

export type RelationOneToMany<T> = {
  data?: { id: number; attributes: T }[];
};

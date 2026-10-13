export type Size = "large" | "medium" | "small";

const fieldSizeToClassMap = {
  "": undefined,
  "small": "max-w-[22ch]!",
  "medium": "max-w-[50ch]!",
  "large": "w-full!"
} as const satisfies Record<Size & "", string>;

export const widthClassname = (size: Size) =>
  fieldSizeToClassMap[size ?? ""];
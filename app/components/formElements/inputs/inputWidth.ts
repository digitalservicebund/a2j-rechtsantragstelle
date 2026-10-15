export type Size = "large" | "medium" | "small";

const fieldSizeToClassMap = {
  "": undefined,
  small: "md:max-w-[22ch]!",
  medium: "md:max-w-[50ch]!",
  large: "w-full!",
} as const satisfies Record<Size | "", string | undefined>;

export const widthClassname = (size: Size) => fieldSizeToClassMap[size ?? ""];

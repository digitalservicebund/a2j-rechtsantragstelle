export type FieldWidth =
  | "3"
  | "5"
  | "7"
  | "10"
  | "16"
  | "24"
  | "36"
  | "54"
  | undefined;

const fieldWidthToClassMap = {
  "": undefined,
  "3": "max-w-[9ch]",
  "5": "max-w-[11ch]",
  "7": "max-w-[13ch]",
  "10": "max-w-[16ch]",
  "16": "max-w-[22ch]",
  "24": "max-w-[30ch]",
  "36": "max-w-[42ch]",
  "54": "max-w-[60ch]",
} as const satisfies Record<FieldWidth & "", string>;

export const widthClassname = (width: FieldWidth) =>
  fieldWidthToClassMap[width ?? ""];

export type FieldWidth = "3" | "5" | "7" | "10" | "16" | "24" | "36" | "54";

export const widthClassname = (width: FieldWidth | undefined) =>
  ({
    "": undefined,
    "3": "w-[9ch]",
    "5": "w-[11ch]",
    "7": "w-[13ch]",
    "10": "w-[16ch]",
    "16": "w-[22ch]",
    "24": "w-[30ch]",
    "36": "w-[42ch] ds-input-select-width-54-36",
    "54": "w-[60ch] ds-input-select-width-54-36",
  })[width ?? ""];

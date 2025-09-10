// Grid class mappings for Tailwind content scanning
export const getGridClass = (
  type: "col-start" | "col-span",
  value: number,
  breakpoint?: "md" | "lg" | "xl",
): string => {
  const prefix = breakpoint ? `${breakpoint}:` : "";
  return `${prefix}${type}-${value}`;
};

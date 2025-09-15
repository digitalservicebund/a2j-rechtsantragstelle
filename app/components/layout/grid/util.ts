import type { Span } from "./types";

const SPAN = [
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "col-span-4",
  "col-span-5",
  "col-span-6",
  "col-span-7",
  "col-span-8",
  "col-span-9",
  "col-span-10",
  "col-span-11",
  "col-span-12",
] as const;
const SPAN_MD = [
  "md:col-span-1",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-5",
  "md:col-span-6",
  "md:col-span-7",
  "md:col-span-8",
  "md:col-span-9",
  "md:col-span-10",
  "md:col-span-11",
  "md:col-span-12",
] as const;
const SPAN_LG = [
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-7",
  "lg:col-span-8",
  "lg:col-span-9",
  "lg:col-span-10",
  "lg:col-span-11",
  "lg:col-span-12",
] as const;
const SPAN_XL = [
  "xl:col-span-1",
  "xl:col-span-2",
  "xl:col-span-3",
  "xl:col-span-4",
  "xl:col-span-5",
  "xl:col-span-6",
  "xl:col-span-7",
  "xl:col-span-8",
  "xl:col-span-9",
  "xl:col-span-10",
  "xl:col-span-11",
  "xl:col-span-12",
] as const;

const START = [
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
  "col-start-8",
  "col-start-9",
  "col-start-10",
  "col-start-11",
  "col-start-12",
] as const;
const START_MD = [
  "md:col-start-1",
  "md:col-start-2",
  "md:col-start-3",
  "md:col-start-4",
  "md:col-start-5",
  "md:col-start-6",
  "md:col-start-7",
  "md:col-start-8",
  "md:col-start-9",
  "md:col-start-10",
  "md:col-start-11",
  "md:col-start-12",
] as const;
const START_LG = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-start-3",
  "lg:col-start-4",
  "lg:col-start-5",
  "lg:col-start-6",
  "lg:col-start-7",
  "lg:col-start-8",
  "lg:col-start-9",
  "lg:col-start-10",
  "lg:col-start-11",
  "lg:col-start-12",
] as const;
const START_XL = [
  "xl:col-start-1",
  "xl:col-start-2",
  "xl:col-start-3",
  "xl:col-start-4",
  "xl:col-start-5",
  "xl:col-start-6",
  "xl:col-start-7",
  "xl:col-start-8",
  "xl:col-start-9",
  "xl:col-start-10",
  "xl:col-start-11",
  "xl:col-start-12",
] as const;

export function getGridClass(
  type: "col-start" | "col-span",
  value: Span,
  bp?: "md" | "lg" | "xl",
): string {
  const idx = value - 1;
  if (type === "col-span") {
    if (bp === "md") return SPAN_MD[idx];
    if (bp === "lg") return SPAN_LG[idx];
    if (bp === "xl") return SPAN_XL[idx];
    return SPAN[idx];
  } else {
    if (bp === "md") return START_MD[idx];
    if (bp === "lg") return START_LG[idx];
    if (bp === "xl") return START_XL[idx];
    return START[idx];
  }
}

export const getPaddingClasses = (pt: string, pb: string) => {
  if (pt && pb) {
    const paddingTop = pt === "default" ? "40" : pt;
    const paddingBottom = pb === "default" ? "40" : pb;
    return `pt-[${paddingTop}px] pb-[${paddingBottom}px]`;
  }
  return "";
};

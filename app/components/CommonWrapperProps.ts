import type { StrapiPadding } from "~/services/cms/models/StrapiPadding";
import type { StrapiContainer } from "~/services/cms/models/StrapiContainer";
import type { StrapiBackground } from "~/services/cms/models/StrapiBackground";
import type { BackgroundColor } from ".";

type Padding =
  | "default"
  | "0" // !pt-0
  | "8" // !pt-8
  | "16" // !pt-16
  | "24" // !pt-24
  | "32" // !pt-32
  | "40" // !pt-40
  | "48" // !pt-48
  | "56" // !pt-56
  | "64"; // !pt-64

export type CommonWrapperProps = {
  backgroundColor?: BackgroundColor;
  paddingTop?: Padding;
  paddingBottom?: Padding;
};

const convertCmsPixels = (cmsPadding: StrapiPadding | null | undefined) =>
  cmsPadding ? (cmsPadding.replace(/^px/, "") as Padding) : "default";

export const wrapperPropsFromCms = (
  cmsData: StrapiContainer | StrapiBackground,
): CommonWrapperProps => ({
  paddingTop: convertCmsPixels(cmsData.paddingTop),
  paddingBottom: convertCmsPixels(cmsData.paddingBottom),
  backgroundColor: cmsData.backgroundColor ?? "default",
});

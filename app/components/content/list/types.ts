import { type ImageProps } from "~/components/common/Image";
import { type KernAccordionProps } from "~/components/kern/KernAccordion";
import { type ButtonProps } from "~/components/kern/KernButton";
import { type KernHeadingProps } from "~/components/kern/KernHeading";

export type ListItemProps = {
  id: number; // Strapi id
  identifier?: string;
  headline?: KernHeadingProps;
  content?: string;
  buttons?: ButtonProps[];
  index?: number;
  accordion?: KernAccordionProps;
  image?: ImageProps;
};

export type ListMarkerProps = {
  index?: number;
  variant: ListVariant;
  image?: ImageProps;
};

export type ListVariant = "unordered" | "numbered" | "stepByStep";

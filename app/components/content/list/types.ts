import { type AccordionProps } from "~/components/Accordion";
import { type ButtonProps } from "~/components/common/Button";
import { type HeadingProps } from "~/components/common/Heading";
import { type ImageProps } from "~/components/Image";

export type ListItemProps = {
  id: number; // Strapi id
  identifier?: string;
  headline?: HeadingProps;
  content?: string;
  buttons?: ButtonProps[];
  index?: number;
  accordion?: AccordionProps;
  image?: ImageProps;
};

export type ListMarkerProps = {
  index?: number;
  variant: ListVariant;
  image?: ImageProps;
};

export type ListVariant = "unordered" | "numbered" | "stepByStep";

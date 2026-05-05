import { type ImageProps } from "~/components/common/Image";
import { type AccordionProps } from "~/components/formElements/Accordion";
import { type ButtonProps } from "~/components/formElements/Button";
import { type HeadingProps } from "~/components/formElements/Heading";

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

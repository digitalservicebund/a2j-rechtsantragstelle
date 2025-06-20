import { type AccordionProps } from "../Accordion";
import { type ButtonProps } from "../Button";
import { type HeadingProps } from "../Heading";
import { type ImageProps } from "../Image";

export type ListItemProps = {
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

import { type AccordionProps } from "../Accordion";
import { type ButtonProps } from "../Button";
import { type HeadingProps } from "../Heading";

export type ListItemProps = {
  identifier?: string;
  headline?: HeadingProps;
  content?: string;
  buttons?: ButtonProps[];
  index?: number;
  accordion?: AccordionProps;
};

export type ListVariant = "unordered" | "numbered" | "stepByStep";

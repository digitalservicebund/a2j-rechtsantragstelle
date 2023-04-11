import React from "react";
import Container from "./Container";
import type { HeadingProps } from "./Heading";
import Heading from "./Heading";
import type { ParagraphProps } from "./Paragraph";
import Paragraph from "./Paragraph";

export interface HeaderProps extends React.ClassAttributes<HTMLHeadingElement> {
  header: HeadingProps;
  description: ParagraphProps;
  hasBackground: boolean;
}

export default function Header({
  header,
  description,
  hasBackground,
  ...props
}: HeaderProps) {
  const headingProps = {
    ...header,
    className: "mb-16",
  };

  return (
    <Container hasBackground={hasBackground} {...props}>
      <Heading {...headingProps} />
      {description && (
        <Paragraph {...description} {...{ className: "ds-heading-03-reg" }} />
      )}
    </Container>
  );
}

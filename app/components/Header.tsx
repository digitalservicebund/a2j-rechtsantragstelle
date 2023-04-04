import React from "react";
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
    className: "mb-4",
  };

  return (
    <div
      {...props}
      className={`${hasBackground ? "bg-blue-100" : ""} containerHeader`}
    >
      <div>
        <Heading {...headingProps} />
        {description && <Paragraph {...description} />}
      </div>
    </div>
  );
}

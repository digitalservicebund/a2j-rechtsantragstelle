import React from "react";
import classNames from "classnames";

export interface ContainerProps
  extends React.ClassAttributes<HTMLHeadingElement> {
  hasBackground: boolean;
  children: React.ReactNode;
}

export default function Container({
  children,
  hasBackground,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={classNames("container", { "bg-blue-100": hasBackground })}
    >
      <div>{children}</div>
    </div>
  );
}

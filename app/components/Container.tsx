import React from "react";

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
      className={`${hasBackground ? "bg-blue-100" : ""} container`}
    >
      <div>{children}</div>
    </div>
  );
}

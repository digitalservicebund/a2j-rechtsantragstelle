import React from "react";

export interface LinkProps extends React.ClassAttributes<typeof Link> {
  text: string;
  url: string;
  className?: string;
}

function Link({ text, url, ...props }: LinkProps) {
  const className = props?.className ? props.className : "";

  return (
    <a href={url} className={className}>
      {text}
    </a>
  );
}

export default Link;

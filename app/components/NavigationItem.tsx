import React from "react";
import Link from "./Link";

export interface NavigationItemProps
  extends React.ClassAttributes<typeof NavigationItem> {
  text: string;
  targeturl?: string;
  baseurl?: string;
}

function NavigationItem({
  text,
  targeturl,
  baseurl,
  ...props
}: NavigationItemProps) {
  return <Link {...props} text={text} url={targeturl} />;
}

export default NavigationItem;

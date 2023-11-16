import { createRemixStub } from "@remix-run/testing";
import { ComponentType, createElement } from "react";

export function remixContext(component: ComponentType) {
  return createElement(createRemixStub([{ path: "/", Component: component }]));
}

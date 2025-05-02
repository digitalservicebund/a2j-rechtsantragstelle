import { ActionFunction, LoaderFunction, createRoutesStub } from "react-router";
import { ComponentType, createElement } from "react";

export function reactRouterContext(
  component: ComponentType,
  loader?: LoaderFunction,
  action?: ActionFunction,
) {
  return createElement(
    createRoutesStub([{ path: "/", Component: component, loader, action }]),
  );
}

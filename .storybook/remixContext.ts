import { ActionFunction, LoaderFunction } from "react-router";
import { createRoutesStub } from "react-router";
import { ComponentType, createElement } from "react";

export function remixContext(
  component: ComponentType,
  loader?: LoaderFunction,
  action?: ActionFunction,
) {
  return createElement(
    createRoutesStub([{ path: "/", Component: component, loader, action }]),
  );
}

import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { ComponentType, createElement } from "react";

export function remixContext(
  component: ComponentType,
  loader?: LoaderFunction,
  action?: ActionFunction,
) {
  return createElement(
    createRemixStub([{ path: "/", Component: component, loader, action }]),
  );
}

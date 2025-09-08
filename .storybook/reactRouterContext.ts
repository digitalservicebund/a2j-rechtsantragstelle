import {
  ActionFunction,
  type LoaderFunction,
  createRoutesStub,
} from "react-router";
import { createElement } from "react";

type RouteComponent = Parameters<typeof createRoutesStub>[0][0]["Component"];

export function reactRouterContext(
  component: RouteComponent,
  loader?: LoaderFunction,
  action?: ActionFunction,
) {
  return createElement(
    createRoutesStub([{ path: "/", Component: component, loader, action }]),
  );
}

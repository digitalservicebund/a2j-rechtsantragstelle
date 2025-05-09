import {
  ActionFunction,
  LoaderFunction,
  createRoutesStub,
  useActionData,
  useLoaderData,
  useMatches,
  useParams,
} from "react-router";
import { ComponentType, createElement } from "react";

export function reactRouterContext(
  component: ComponentType<{
    params: ReturnType<typeof useParams>;
    loaderData: ReturnType<typeof useLoaderData>;
    actionData: ReturnType<typeof useActionData>;
    matches: ReturnType<typeof useMatches>;
  }>,
  loader?: LoaderFunction,
  action?: ActionFunction,
) {
  return createElement(
    createRoutesStub([{ path: "/", Component: component, loader, action }]),
  );
}

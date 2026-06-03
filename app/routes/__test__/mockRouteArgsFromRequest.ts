import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  RouterContextProvider,
} from "react-router";

export const mockRouteArgsFromRequest = (
  request: Request,
  url: URL,
  params = {},
) =>
  ({
    request,
    params,
    context: new RouterContextProvider(),
    pattern: "",
    url,
  }) satisfies LoaderFunctionArgs | ActionFunctionArgs;

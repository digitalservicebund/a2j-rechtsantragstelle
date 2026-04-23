import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  RouterContextProvider,
} from "react-router";

export const mockRouteArgsFromRequest = (request: Request, params = {}) =>
  ({
    request,
    params,
    context: new RouterContextProvider(),
    unstable_pattern: "",
    unstable_url: new URL(request.url),
  }) satisfies LoaderFunctionArgs | ActionFunctionArgs;

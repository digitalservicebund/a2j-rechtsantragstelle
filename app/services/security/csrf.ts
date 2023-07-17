export const CSRFKey = "csrf";

export function csrfFromRouteLoader(routeLoaderdata: unknown) {
  if (routeLoaderdata)
    return (routeLoaderdata as Record<string, string>)[CSRFKey];
}

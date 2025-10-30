export const mockRouteArgsFromRequest = (request: Request, params = {}) => ({
  request,
  params,
  context: {},
  unstable_pattern: "",
});

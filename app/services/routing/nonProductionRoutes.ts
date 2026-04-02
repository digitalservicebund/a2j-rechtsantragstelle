const nonProductionRoutes = ["/kitchensink"];
export const isNonProductiveRoute = (pathname: string) =>
  nonProductionRoutes.some((route) => pathname.startsWith(route));

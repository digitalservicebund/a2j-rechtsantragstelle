const nonProductionRoutes = ["/kitchensink", "/justizde"];
export const isNonProductiveRoute = (pathname: string) =>
  nonProductionRoutes.some((route) => pathname.startsWith(route));

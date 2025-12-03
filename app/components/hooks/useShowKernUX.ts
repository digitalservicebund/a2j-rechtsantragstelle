import { useRouteLoaderData } from "react-router";
import type { RootLoader } from "~/root";

export const useShowKernUX = (): boolean => {
  const rootData = useRouteLoaderData<RootLoader>("root");
  return rootData?.showKernUX ?? false;
};

import { useLoaderData } from "@remix-run/react";
import type { loader } from "../visualisierung";

export function Visualisierung() {
  const { url } = useLoaderData<typeof loader>();
  return <img alt="current flow chart" src={url}></img>;
}

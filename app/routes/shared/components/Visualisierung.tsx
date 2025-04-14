import { useLoaderData } from "react-router";
import type { loader } from "../visualisierung.server";

export function Visualisierung() {
  const { url } = useLoaderData<typeof loader>();
  return <img alt="current flow chart" src={url}></img>;
}

import invariant from "tiny-invariant";
import type { Params } from "@remix-run/react";

export function splatFromParams(params: Params) {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");
  return splat;
}

export function parentFromParams(pathname: string, params: Params) {
  const splat = params["*"];
  invariant(splat && pathname.endsWith(splat));
  return pathname.slice(0, -splat.length - 1);
}

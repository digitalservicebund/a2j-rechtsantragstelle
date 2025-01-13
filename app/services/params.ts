import type { Params } from "@remix-run/react";
import invariant from "tiny-invariant";

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

export const isPreview = (searchParams: URLSearchParams) =>
  searchParams.get("preview") !== null;

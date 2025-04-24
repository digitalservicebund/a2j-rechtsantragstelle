import type { Params } from "react-router";
import invariant from "tiny-invariant";
import { config } from "./env/web";

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

export const skipFlowParamAllowedAndEnabled = (searchParams: URLSearchParams) =>
  config().ENVIRONMENT !== "production" &&
  searchParams.get("skipFlow") !== null;

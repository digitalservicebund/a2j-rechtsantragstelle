import { type LoaderFunctionArgs, redirect } from "react-router";
import { splatFromParams } from "~/services/params";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const splat = splatFromParams(params);
  return redirect(`/feedback/${splat}`);
};
